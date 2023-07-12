/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-05
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** vue3 项目里建议直接用 vueuse useStorage 方法 */

import type { CacheType } from '@/types/modules/utils'

/**
 *
 * @param key 需要设置的key
 * @param value 需要缓存的值
 */
function setStorage<T = unknown>(
  key: string,
  value: T,
  type: CacheType = 'sessionStorage',
) {
  if (!key) {
    console.error('Failed to set stored data: key is empty or undefined')

    return
  }

  try {
    const waitCacheValue = JSON.stringify(value)

    type === 'localStorage'
      ? window.localStorage.setItem(key, waitCacheValue)
      : window.sessionStorage.setItem(key, waitCacheValue)
  } catch (error) {
    console.error(`Failed to set stored data for key '${key}'`, error)
  }
}

/** 重载函数 getStorage */
function getStorage<T>(key: string, storageType: CacheType, defaultValue: T): T

/** 重载函数 getStorage */
function getStorage<T>(
  key: string,
  storageType?: CacheType,
  defaultValue?: T,
): T | null

/**
 *
 * @param key 需要获取目标缓存的key
 * @returns 获取缓存值
 */
function getStorage<T>(
  key: string,
  storageType: CacheType = 'sessionStorage',
  defaultValue?: T,
): T | null {
  try {
    const data =
      storageType === 'localStorage'
        ? window.localStorage.getItem(key)
        : window.sessionStorage.getItem(key)

    if (data === null) {
      return defaultValue ?? null
    }

    return JSON.parse(data) as T
  } catch (error) {
    console.error(`Failed to get stored data for key '${key}'`, error)

    return defaultValue ?? null
  }
}

/**
 *
 * @param key 需要删除的缓存值key
 *
 * key:
 *   - all: 删除所有缓存值
 *   - all-sessionStorage: 删除所有 sessionStorage 缓存值
 *   - all-localStorage: 删除所有 localStorage 缓存值
 */
function removeStorage(
  key: string | 'all' | 'all-sessionStorage' | 'all-localStorage',
  type: CacheType = 'sessionStorage',
) {
  switch (key) {
    case 'all':
      window.window.localStorage.clear()
      window.sessionStorage.clear()

      break

    case 'all-sessionStorage':
      window.sessionStorage.clear()

      break

    case 'all-localStorage':
      window.localStorage.clear()

      break

    default:
      if (!key) {
        console.error('Failed to remove stored data: key is empty or undefined')

        return
      }

      type === 'localStorage'
        ? window.localStorage.removeItem(key)
        : window.sessionStorage.removeItem(key)
  }
}

export { setStorage, getStorage, removeStorage }
