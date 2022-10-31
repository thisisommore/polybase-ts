import { Polybase } from '../Polybase'
import { Collection } from '../Collection'
import { defaultRequest } from './util'

// const clock = FakeTimers.install()
const baseURL = 'https://base.com/'

let sender: jest.Mock

beforeEach(() => {
  sender = jest.fn()
})

test('polybase is instance of Polybase', () => {
  const s = new Polybase()
  expect(s).toBeInstanceOf(Polybase)
})

test('collection() returns collection', () => {
  const s = new Polybase({ sender })
  expect(s.collection('a')).toBeInstanceOf(Collection)
})

test('collection() returns collection using default namespace', () => {
  const s = new Polybase({ sender, defaultNamespace: 'hello-world' })
  expect(s.collection('a/path').id).toBe('hello-world/a/path')
})

test('collection() returns collection using absolute path', () => {
  const s = new Polybase({ sender, defaultNamespace: 'hello-world' })
  expect(s.collection('/a/path').id).toBe('a/path')
})

test('collection is reused', () => {
  const s = new Polybase({
    sender,
  })
  const a = s.collection('a')
  expect(s.collection('a')).toBe(a)
})

test('creates collections from schema in namespace', async () => {
  const s = new Polybase({ sender, baseURL })
  const namespace = 'test'
  const schema = `
    contract Col {
      id: string;
      name?: string;
    }

    contract Col2 {
      id: string;
    }
  `
  const n = await s.applySchema(schema, namespace)

  expect(sender).toHaveBeenCalledWith({
    ...defaultRequest,
    baseURL,
    url: '/contracts/$Contract',
    method: 'POST',
    data: {
      args: ['test/Col', schema],
    },
    headers: {
      'X-Polybase-Client': 'polybase@ts/client:v0',
    },
  })

  expect(sender).toHaveBeenCalledWith({
    ...defaultRequest,
    baseURL,
    url: '/contracts/$Contract',
    method: 'POST',
    data: {
      args: ['test/Col2', schema],
    },
    headers: {
      'X-Polybase-Client': 'polybase@ts/client:v0',
    },
  })

  for (const item of n) {
    expect(item).toBeInstanceOf(Collection)
  }

  expect(n.map((c) => c.id)).toContainEqual('test/Col')
  expect(n.map((c) => c.id)).toContainEqual('test/Col2')
})

test('caches a collection', () => {
  const s = new Polybase({ sender, baseURL })

  const c1 = s.collection('hello')
  const c2 = s.collection('hello')

  expect(c1).toBe(c2)
})
