import FakeTimers from '@sinonjs/fake-timers'
import { Subscription } from '../Subscription'
import { Client } from '../Client'

const clock = FakeTimers.install()

let sender: jest.Mock
let signer: jest.Mock
let client: Client

beforeEach(() => {
  sender = jest.fn()
  signer = jest.fn()
  client = new Client(sender, signer)
})

test('sub is instance of Subscription', () => {
  const c = new Subscription({
    url: '/col/id',
    method: 'GET',
    params: {},
  }, client)
  expect(c).toBeInstanceOf(Subscription)
})

test('start/stop subscriber', async () => {
  const spy = jest.fn()
  const rec = {
    id: '123',
  }
  const timestamp = '2011-10-05T14:48:00.000Z'

  sender.mockResolvedValue({
    status: 200,
    data: {
      data: rec,
    },
    headers: {
      'x-spacetime-timestamp': timestamp,
    },
  })

  const c = new Subscription({
    url: '/col/id',
    method: 'GET',
    params: {},
  }, client)

  c.subscribe(spy)

  expect(sender).toHaveBeenCalled()

  await clock.tickAsync(0)

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith({
    data: rec,
  })

  // Stops on the next run
  await clock.tickAsync(100)
  expect(spy).toHaveBeenCalledTimes(2)

  c.stop()

  // Has stopped
  await clock.tickAsync(200)
  expect(spy).toHaveBeenCalledTimes(2)
})

test('subscriber does not error on 304', async () => {
  const spyOk = jest.fn()
  const spyErr = jest.fn()

  sender.mockRejectedValue({
    response: {
      status: 304,
    },
  })

  const c = new Subscription({
    url: '/col/id',
    method: 'GET',
    params: {},
  }, client)

  const unsub = c.subscribe(spyOk, spyErr)

  await clock.tickAsync(0)

  expect(spyOk).toBeCalledTimes(0)
  expect(spyErr).toBeCalledTimes(0)
  expect(sender).toBeCalledTimes(1)

  unsub()
})

test('subscriber errors on error', async () => {
  const spyOk = jest.fn()
  const spyErr = jest.fn()

  sender.mockRejectedValue({
    response: {
      status: 400,
    },
  })

  const c = new Subscription({
    url: '/col/id',
    method: 'GET',
    params: {},
  }, client)

  const unsub = c.subscribe(spyOk, spyErr)

  await clock.tickAsync(0)

  expect(spyOk).toBeCalledTimes(0)
  expect(spyErr).toBeCalledTimes(1)
  expect(sender).toBeCalledTimes(1)

  unsub()
})

test('subscriber closes on unsub', () => {
  const c = new Subscription({
    url: '/col/id',
    method: 'GET',
    params: {},
  }, client)

  c.stop = jest.fn(c.stop)

  const unsub = c.subscribe(jest.fn())
  unsub()

  expect(c.stop).toHaveBeenCalledTimes(1)
})
