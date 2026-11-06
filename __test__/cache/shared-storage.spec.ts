import { createStorage } from '@ray-template/utils/storage'

it('namespaces JSON values and reads the current backend instead of caching a copy', () => {
  const backend = new Map<string, string>()
  const storage = createStorage(
    {
      getItem: (key) => backend.get(key) ?? null,
      setItem: (key, value) => {
        backend.set(key, value)
      },
      removeItem: (key) => {
        backend.delete(key)
      },
    },
    'table:',
  )

  storage.set('columns', ['name'])
  expect(backend.get('table:columns')).toBe('["name"]')
  backend.set('table:columns', '["status"]')
  expect(storage.get('columns')).toEqual(['status'])
  storage.remove('columns')
  expect(storage.get('columns')).toBeNull()
})

it('preserves a saved value when a replacement cannot be serialized', () => {
  const setItem = vi.fn()
  const storage = createStorage({
    getItem: () => '"saved"',
    setItem,
    removeItem: vi.fn(),
  })
  const circular: { self?: unknown } = {}

  circular.self = circular

  for (const value of [void 0, Symbol('value'), () => 1, circular, 1n]) {
    storage.set('value', value)
  }

  expect(setItem).not.toHaveBeenCalled()
  expect(storage.get('value')).toBe('saved')
  storage.set('value', null)
  expect(setItem).toHaveBeenCalledExactlyOnceWith('value', 'null')
})

it('contains unavailable-backend errors and malformed JSON', () => {
  const fail = () => {
    throw new Error('storage denied')
  }
  const storage = createStorage({
    getItem: fail,
    setItem: fail,
    removeItem: fail,
  })

  expect(storage.get('value')).toBeNull()
  expect(() => storage.set('value', 1)).not.toThrow()
  expect(() => storage.remove('value')).not.toThrow()
  expect(
    createStorage({
      getItem: () => '{bad',
      setItem: vi.fn(),
      removeItem: vi.fn(),
    }).get('value'),
  ).toBeNull()
})
