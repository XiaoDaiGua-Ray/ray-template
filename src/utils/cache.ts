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

import type { StorageLike, RemoveStorageKey } from '@/types/modules/utils'

/**
 *
 * @param key cache key
 * @param storageType session or local
 *
 * 查找当前缓存中是否含有某个 key
 * 默认查找 sessionStorage
 */
function hasStorage(key: string, storageType: StorageLike = 'sessionStorage') {
  return getStorage(key, storageType) !== null
}

/**
 *
 * @param key 需要设置的key
 * @param value 需要缓存的值
 */
function setStorage<T = unknown>(
  key: string,
  value: T,
  type: StorageLike = 'sessionStorage',
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

function getStorage<T = unknown>(
  key: string,
  storageType: StorageLike,
  defaultValue: T,
): T

function getStorage<T = unknown>(
  key: string,
  storageType?: StorageLike,
  defaultValue?: T,
): T | null

/**
 *
 * @param key cache
 * @param storageType session or local
 * @param defaultValue default value
 *
 * 获取缓存值
 */
function getStorage<T = unknown>(
  key: string,
  storageType: StorageLike = 'sessionStorage',
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
  key: RemoveStorageKey,
  type: StorageLike = 'sessionStorage',
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

export { setStorage, getStorage, removeStorage, hasStorage }
