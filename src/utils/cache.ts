/**
 *
 * @param key 需要设置的key
 * @param value 需要缓存的值
 */
export const useSetCache = <T>(
  key: string,
  value: T,
  type: TCacheType = 'sessionStorage',
) => {
  type === 'localStorage'
    ? window.localStorage.setItem(key, JSON.stringify(value))
    : window.sessionStorage.setItem(key, JSON.stringify(value))
}

/**
 *
 * @param key 需要获取目标缓存的key
 *
 * @returns 所获取的缓存值
 */
export const useGetCache = (
  key: string,
  type: TCacheType = 'sessionStorage',
) => {
  let data =
    type === 'localStorage'
      ? window.localStorage.getItem(key)
      : window.sessionStorage.getItem(key)

  return Object.is(data, null) ? 'no' : JSON.parse(data as string)
}

/**
 *
 * @param key 需要删除的缓存值key
 */
export const useRemoveCache = (
  key: string | 'all' | 'all-sessionStorage' | 'all-localStorage',
  type: TCacheType = 'sessionStorage',
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
