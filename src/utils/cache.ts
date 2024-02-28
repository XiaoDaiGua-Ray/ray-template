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

import { APP_CATCH_KEY_PREFIX } from '@/app-config'

import type { StorageLike, StorageOptions, RemoveStorageFC } from '@/types'

/**
 *
 * @param key 需要删除的缓存值key
 * @param storageType 需要删除的缓存类型
 * @param options 配置项
 *
 * @description
 * 查找当前缓存中是否含有某个 key。
 *
 * 默认查找 sessionStorage。
 *
 * @example
 * hasStorage('signing') // 查找 session 中 signing 缓存字段
 */
function hasStorage(
  key: string,
  storageType: StorageLike = 'sessionStorage',
  options?: StorageOptions,
) {
  const { prefix, prefixKey } = options ?? {}
  const _prefix = prefix ? prefixKey || APP_CATCH_KEY_PREFIX : ''
  const storage =
    storageType === 'localStorage' ? window.localStorage : window.sessionStorage

  return !!Object.keys(storage).find((curr) => curr === _prefix + key)
}

/**
 *
 * @param key 需要删除的缓存值key
 * @param type 需要删除的缓存类型
 * @param options 配置项
 *
 * @description
 * 设置缓存值，默认设置 sessionStorage。
 *
 * 如果 key 为空，则会打印错误信息。
 *
 * @example
 * setStorage('demo', 'hi') // 设置 session 中 demo 缓存字段
 * setStorage('demo', 'hi', 'localStorage') // 设置 local 中 demo 缓存字段
 * setStorage('demo', 'hi', 'sessionStorage', { prefix: true, prefixKey: 'ray' }) // 设置 session 中 ray_demo 缓存字段
 */
function setStorage<T = unknown>(
  key: string,
  value: T,
  storageType: StorageLike = 'sessionStorage',
  options?: StorageOptions,
) {
  if (!key) {
    console.error(
      `[setStorage]: Failed to set stored data: key ${key} is empty`,
    )

    return
  }

  const { prefix, prefixKey } = options ?? {}
  const _prefix = prefix ? prefixKey || APP_CATCH_KEY_PREFIX : ''

  try {
    const waitCacheValue = JSON.stringify(value)

    storageType === 'localStorage'
      ? window.localStorage.setItem(_prefix + key, waitCacheValue)
      : window.sessionStorage.setItem(_prefix + key, waitCacheValue)
  } catch (error) {
    console.error(
      `[setStorage]: Failed to set stored data for key '${key}'`,
      error,
    )
  }
}

function getStorage<T = unknown>(
  key: string,
  storageType: StorageLike,
  options?: StorageOptions<T>,
): T

function getStorage<T = unknown>(
  key: string,
  storageType?: StorageLike,
  options?: StorageOptions<T>,
): T | null

/**
 *
 * @param key 需要删除的缓存值key
 * @param type 需要删除的缓存类型
 * @param options 配置项
 *
 * @description
 * 获取缓存值。
 *
 * 默认获取 sessionStorage。
 *
 * 如果 key 为空，则会打印错误信息。
 *
 * @example
 * getStorage('demo') // 获取 session 中 demo 缓存字段
 * getStorage('demo', 'localStorage') // 获取 local 中 demo 缓存字段
 * getStorage('demo', 'sessionStorage', { prefix: true, prefixKey: 'ray' }) // 获取 session 中 ray_demo 缓存字段
 */
function getStorage<T = unknown>(
  key: string,
  storageType: StorageLike = 'sessionStorage',
  options?: StorageOptions<T>,
): T | null {
  const { prefix, prefixKey, defaultValue } = options ?? {}
  const _prefix = prefix ? prefixKey || APP_CATCH_KEY_PREFIX : ''

  try {
    const data =
      storageType === 'localStorage'
        ? window.localStorage.getItem(_prefix + key)
        : window.sessionStorage.getItem(_prefix + key)

    if (data === null) {
      return defaultValue ?? null
    }

    return JSON.parse(data) as T
  } catch (error) {
    console.error(
      `[getStorage]: Failed to get stored data for key '${key}'`,
      error,
    )

    return defaultValue ?? null
  }
}

/**
 *
 * @param key 需要删除的缓存值key
 * @param type 需要删除的缓存类型
 * @param options 配置项
 *
 * @description
 * 删除缓存值。
 *
 * 默认删除 sessionStorage。
 *
 * 预保留了 __all__、__all_sessionStorage__、__all_localStorage__ 三个 key，
 * 分别代表清空所有缓存、清空 sessionStorage 缓存、清空 localStorage 缓存。
 *
 * @example
 * removeStorage('__all__', 'all') // 清空所有缓存
 * removeStorage('__all_sessionStorage__', 'sessionStorage') // 清空 sessionStorage 缓存
 * removeStorage('__all_localStorage__', 'localStorage') // 清空 localStorage 缓存
 * removeStorage('signing', 'sessionStorage' || 'localStorage') // 清空 session 中 signing 缓存字段
 */
const removeStorage: RemoveStorageFC = (key, storageType, options) => {
  if (!key) {
    console.error(
      `[removeStorage]: Failed to remove stored data: key ${key} is empty or undefined`,
    )
    return
  }

  const { prefix, prefixKey } = options ?? {}
  const _prefix = prefix ? prefixKey || APP_CATCH_KEY_PREFIX : ''
  const localStorageKeys = Object.keys(window.localStorage)
  const sessionStorageKeys = Object.keys(window.sessionStorage)

  const remove = (isAll: boolean, removeType?: StorageLike) => {
    const keys = isAll
      ? [...sessionStorageKeys, ...localStorageKeys]
      : removeType === 'localStorage'
        ? localStorageKeys
        : sessionStorageKeys
    keys.forEach((curr) => {
      if (key === '__all__') {
        window.sessionStorage.removeItem(_prefix + curr)
        window.localStorage.removeItem(_prefix + curr)
      } else {
        removeType === 'localStorage'
          ? window.localStorage.removeItem(_prefix + curr)
          : window.sessionStorage.removeItem(_prefix + curr)
      }
    })
  }

  switch (key) {
    case '__all__':
      remove(true)

      break

    case '__all_sessionStorage__':
      remove(false, 'sessionStorage')

      break

    case '__all_localStorage__':
      remove(false, 'localStorage')

      break

    default:
      storageType === 'localStorage'
        ? window.localStorage.removeItem(_prefix + key)
        : window.sessionStorage.removeItem(_prefix + key)

      break
  }
}

export { setStorage, getStorage, removeStorage, hasStorage }
