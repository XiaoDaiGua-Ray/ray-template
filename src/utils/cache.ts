/**
 *
 * @param key 需要设置的key
 * @param value 需要缓存的值
 */
export const setCache = <T>(
  key: string,
  value: T,
  type: CacheType = 'sessionStorage',
) => {
  const waitCacheValue = JSON.stringify(value)

  type === 'localStorage'
    ? window.localStorage.setItem(key, waitCacheValue)
    : window.sessionStorage.setItem(key, waitCacheValue)
}

/**
 *
 * @param key 需要获取目标缓存的key
 *
 * @returns 获取缓存值
 */
export const getCache = (key: string, type: CacheType = 'sessionStorage') => {
  const data =
    type === 'localStorage'
      ? window.localStorage.getItem(key)
      : window.sessionStorage.getItem(key)

  return Object.is(data, null) ? 'no' : JSON.parse(data as string)
}

/**
 *
 * @param key 需要删除的缓存值key
 */
export const removeCache = (
  key: string | 'all' | 'all-sessionStorage' | 'all-localStorage',
  type: CacheType = 'sessionStorage',
) => {
  if (key === 'all') {
    window.window.localStorage.clear()
    window.sessionStorage.clear()
  } else if (key === 'all-sessionStorage') {
    window.sessionStorage.clear()
  } else if (key === 'all-localStorage') {
    window.localStorage.clear()
  } else {
    type === 'localStorage'
      ? window.localStorage.removeItem(key)
      : window.sessionStorage.removeItem(key)
  }
}
