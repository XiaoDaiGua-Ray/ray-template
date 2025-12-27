import {
  getStorage,
  hasStorage,
  removeStorage,
  setStorage,
} from '../../src/utils/cache'

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
