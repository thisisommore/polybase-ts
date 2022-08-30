import { AxiosError } from 'axios'
import merge from 'lodash.merge'
import { Client } from './Client'
import { wrapError, SpacetimeError } from './errors'
import { Request } from './types'

export type SubscriptionFn<T> = ((data: T) => void)
export type SubscriptionErrorFn = ((err: SpacetimeError) => void)

export interface SubscriptionOptions {
  // Default timeout between long poll requests
  timeout: number
  // Max timeout after error backoff
  maxErrorTimeout: number
}

const defaultOptions: SubscriptionOptions = {
  timeout: 100,
  maxErrorTimeout: 60 * 1000,
}

export interface Listener<T> {
  fn: SubscriptionFn<T>
  errFn?: SubscriptionErrorFn
}

export class Subscription<T> {
  private listeners: Listener<T>[]
  private req: Request
  private client: Client
  private since?: string
  private aborter?: () => void
  private stopped = true
  private options: SubscriptionOptions
  private errors = 0
  private data?: T
  private timer?: number

  constructor (req: Request, client: Client, options?: Partial<SubscriptionOptions>) {
    this.req = req
    this.client = client
    this.listeners = []
    this.options = merge({}, defaultOptions, options)
  }

  tick = async () => {
    if (this.stopped) return

    const params = this.req.params ?? {}
    if (this.since) {
      params.since = `${this.since}`
    }

    try {
      const req = this.client.request({
        ...this.req,
        params,
      })
      this.aborter = req.abort
      const res = await req.send()

      this.since = res.headers['x-spacetime-timestamp'] ?? `${Date.now() / 1000}`

      // TODO: this is not nice, we should handle proccessing resp in
      // parent doc or query
      this.data = Array.isArray(res.data?.data)
        ? res.data?.data
        : res.data

      this.listeners.forEach(({ fn }) => {
        if (this.data) fn(this.data)
      })
    } catch (err: any) {
      // Get the status code from the error
      const statusCode = err.statusCode ?? err.status ??
          err.code ?? err.response?.status

      // Don't error for 304
      if (statusCode !== 304) {
        // TODO: we should create a client abort error
        if (err instanceof AxiosError) {
          // We cancelled the request
          if (err.code === 'ERR_CANCELED') {
            return
          }
        }

        let e = err
        if (!(err instanceof SpacetimeError)) {
          e = wrapError(err)
        }

        // Send error to listeners
        this.listeners.forEach(({ errFn }) => {
          if (errFn) errFn(e)
        })

        // Also log to console
        // console.error(err)

        this.errors += 1

        // Longer timeout before next tick if we
        //  received an error
        const errTimeout = Math.min(
          1000 * this.errors,
          this.options.maxErrorTimeout,
        )
        this.timer = setTimeout(() => {
          this.tick()
        }, errTimeout) as unknown as number

        return
      }
    }

    this.errors = 0

    // If no since has been stored, then we need to wait longer
    // because
    this.timer = setTimeout(() => {
      this.tick()
    }, this.options.timeout) as unknown as number
  }

  subscribe = (fn: SubscriptionFn<T>, errFn?: SubscriptionErrorFn) => {
    const l = { fn, errFn }
    this.listeners.push(l)
    if (this.data) {
      fn(this.data)
    }
    this.start()
    return () => {
      const index = this.listeners.indexOf(l)

      // Already removed, shouldn't happen
      if (index === -1) return

      // Remove the listener
      this.listeners.splice(index, 1)

      // Stop if no more listeners
      if (this.listeners.length === 0) {
        this.stop()
      }
    }
  }

  start = async () => {
    if (this.stopped) {
      this.stopped = false
      this.tick()
    }
  }

  // TODO: prevent race conditions by waiting for abort
  // before allowing start again
  stop = async () => {
    this.stopped = true
    if (this.timer) clearTimeout(this.timer)
    this.since = undefined
    if (this.aborter) this.aborter()
  }
}
