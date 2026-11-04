import {
  getStorage,
  removeStorage,
  setStorage,
} from '../../apps/admin/src/utils/cache'
import { useMemoryCache } from '../../apps/admin/src/utils/cache-backend'

it('keeps writes and bulk clears in the documentation example out of the real app storage', () => {
  const key = 'ray:example-isolation-test'

  localStorage.setItem(key, JSON.stringify('admin local'))
  sessionStorage.setItem(key, JSON.stringify('admin session'))

  try {
    useMemoryCache()
    expect(getStorage(key, 'localStorage')).toBeNull()
    expect(getStorage(key, 'sessionStorage')).toBeNull()

    setStorage(key, 'example local', 'localStorage')
    setStorage(key, 'example session', 'sessionStorage')
    expect(getStorage(key, 'localStorage')).toBe('example local')
    expect(getStorage(key, 'sessionStorage')).toBe('example session')

    removeStorage('__all__', 'all')
    expect(getStorage(key, 'localStorage')).toBeNull()
    expect(getStorage(key, 'sessionStorage')).toBeNull()
    expect(localStorage.getItem(key)).toBe(JSON.stringify('admin local'))
    expect(sessionStorage.getItem(key)).toBe(JSON.stringify('admin session'))
  } finally {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  }
})
