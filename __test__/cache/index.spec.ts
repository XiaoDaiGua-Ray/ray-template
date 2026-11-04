import {
  getStorage,
  hasStorage,
  removeStorage,
  setStorage,
} from '../../apps/admin/src/utils/cache'

describe('cache utils', () => {
  const __DEMO__KEY = '__DEMO__KEY'
  const __DEMO__VALUE = '__DEMO__VALUE'
  const __PRE__KEY = '__PRE__KEY'

  it('use setStorage set cache in localStorage and sessionStorage', () => {
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'sessionStorage')
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'localStorage')

    expect(hasStorage(__DEMO__KEY, 'sessionStorage')).toBe(true)
    expect(hasStorage(__DEMO__KEY, 'localStorage')).toBe(true)
  })

  it('use getStorage get cache', () => {
    expect(getStorage(__DEMO__KEY, 'sessionStorage')).toBe(__DEMO__VALUE)
    expect(getStorage(__DEMO__KEY, 'localStorage')).toBe(__DEMO__VALUE)
  })

  it('use removeStorage remove cache', () => {
    removeStorage(__DEMO__KEY, 'sessionStorage')
    removeStorage(__DEMO__KEY, 'localStorage')

    expect(hasStorage(__DEMO__KEY, 'sessionStorage')).toBe(false)
    expect(hasStorage(__DEMO__KEY, 'localStorage')).toBe(false)
  })

  it('use removeStorage remove all localStorage and sessionStorage cache', () => {
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'sessionStorage')
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'localStorage')

    removeStorage('__all_sessionStorage__', 'sessionStorage')
    removeStorage('__all_localStorage__', 'localStorage')

    expect(hasStorage(__DEMO__KEY, 'sessionStorage')).toBe(false)
    expect(hasStorage(__DEMO__KEY, 'localStorage')).toBe(false)
  })

  it('use removeStorage remove all cache', () => {
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'sessionStorage')
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'localStorage')

    removeStorage('__all__', 'all')

    expect(hasStorage(__DEMO__KEY, 'sessionStorage')).toBe(false)
    expect(hasStorage(__DEMO__KEY, 'localStorage')).toBe(false)
  })

  it('setStorage with prefix', () => {
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'sessionStorage', {
      prefix: true,
      prefixKey: __PRE__KEY,
    })
    setStorage(__DEMO__KEY, __DEMO__VALUE, 'localStorage', {
      prefix: true,
      prefixKey: __PRE__KEY,
    })

    expect(
      hasStorage(__DEMO__KEY, 'sessionStorage', {
        prefix: true,
        prefixKey: __PRE__KEY,
      }),
    ).toBe(true)
    expect(
      hasStorage(__DEMO__KEY, 'localStorage', {
        prefix: true,
        prefixKey: __PRE__KEY,
      }),
    ).toBe(true)
  })

  it('getStorage with prefix', () => {
    expect(
      getStorage(__DEMO__KEY, 'sessionStorage', {
        prefix: true,
        prefixKey: __PRE__KEY,
      }),
    ).toBe(__DEMO__VALUE)
    expect(
      getStorage(__DEMO__KEY, 'localStorage', {
        prefix: true,
        prefixKey: __PRE__KEY,
      }),
    ).toBe(__DEMO__VALUE)
  })

  it('removeStorage with prefix', () => {
    removeStorage(__DEMO__KEY, 'sessionStorage', {
      prefix: true,
      prefixKey: __PRE__KEY,
    })
    removeStorage(__DEMO__KEY, 'localStorage', {
      prefix: true,
      prefixKey: __PRE__KEY,
    })

    expect(
      hasStorage(__DEMO__KEY, 'sessionStorage', {
        prefix: true,
        prefixKey: __PRE__KEY,
      }),
    ).toBe(false)
    expect(
      hasStorage(__DEMO__KEY, 'localStorage', {
        prefix: true,
        prefixKey: __PRE__KEY,
      }),
    ).toBe(false)
  })
})

describe('storage failures and namespace boundaries', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => vi.restoreAllMocks())

  it('preserves falsy JSON values and leaves prior data intact on a bad write', () => {
    setStorage('test', false)
    setStorage('test', void 0)
    expect(hasStorage('test')).toBe(true)
    expect(getStorage('test')).toBe(false)
    expect(console.error).toHaveBeenCalledOnce()
    setStorage('test', null)
    expect(getStorage('test', void 0, { defaultValue: 'fallback' })).toBeNull()
  })

  it('uses the fallback for corrupt JSON or an unavailable storage area', () => {
    sessionStorage.setItem('broken', 'invalid JSON')
    expect(
      getStorage('broken', 'sessionStorage', { defaultValue: false }),
    ).toBe(false)

    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    expect(hasStorage('test')).toBe(false)
    expect(getStorage('test', 'sessionStorage', { defaultValue: 7 })).toBe(7)
    expect(() => setStorage('test', 'value')).not.toThrow()
    expect(() => removeStorage('test', 'sessionStorage')).not.toThrow()
  })

  it('removes prefixed keys from both stores without clearing adjacent namespaces', () => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.setItem('test:a', '1')
      storage.setItem('test:b', '2')
      storage.setItem('test-other:a', '3')
    }

    removeStorage('__all__', 'all', { prefix: true, prefixKey: 'test:' })

    for (const storage of [localStorage, sessionStorage]) {
      expect(storage.length).toBe(1)
      expect(storage.getItem('test-other:a')).toBe('3')
    }
  })
})
