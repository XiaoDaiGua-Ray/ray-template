import { APP_CATCH_KEY_PREFIX } from '@/app-config'

import type { StorageLike, StorageOptions, RemoveStorageFC } from '@/types'

/**
 * @param type 存储类型
 * @returns Storage 实例
 */
const getStorageInstance = (type: StorageLike = 'sessionStorage'): Storage =>
  type === 'localStorage' ? window.localStorage : window.sessionStorage

/**
 * 获取带前缀的键名
 * @param key 原始键名
 * @param options 配置项
 * @returns 处理后的键名
 */
const getKeyWithPrefix = (key: string, options?: StorageOptions): string => {
  const { prefix, prefixKey } = options ?? {}

  return prefix ? (prefixKey || APP_CATCH_KEY_PREFIX) + key : key
}

/**
 * @param key 需要查找的缓存值key
 * @param storageType 需要查找的缓存类型
 * @param options 配置项
 *
 * @description
 * 查找当前缓存中是否含有某个 key。
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
  const prefixedKey = getKeyWithPrefix(key, options)
  const storage = getStorageInstance(storageType)

  return Object.keys(storage).includes(prefixedKey)
}

/**
 * @param key 需要设置的缓存值key
 * @param value 需要设置的值
 * @param storageType 需要设置的缓存类型
 * @param options 配置项
 *
 * @description
 * 设置缓存值，默认设置 sessionStorage。
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
    console.error('[setStorage]: Failed to set stored data: key is empty')

    return
  }

  const prefixedKey = getKeyWithPrefix(key, options)
  const storage = getStorageInstance(storageType)

  try {
    storage.setItem(prefixedKey, JSON.stringify(value))
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
  options: StorageOptions<T> & { defaultValue: T },
): T

function getStorage<T = unknown>(
  key: string,
  storageType?: StorageLike,
  options?: Omit<StorageOptions<T>, 'defaultValue'>,
): T | null

/**
 * @param key 需要获取的缓存值key
 * @param storageType 需要获取的缓存类型
 * @param options 配置项
 *
 * @description
 * 获取缓存值。
 * 默认获取 sessionStorage。
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
  const prefixedKey = getKeyWithPrefix(key, options)
  const storage = getStorageInstance(storageType)
  const { defaultValue } = options ?? {}

  try {
    const data = storage.getItem(prefixedKey)

    return data === null ? defaultValue ?? null : (JSON.parse(data) as T)
  } catch (error) {
    console.error(
      `[getStorage]: Failed to get stored data for key '${key}'`,
      error,
    )

    return defaultValue ?? null
  }
}

/**
 * @param key 需要删除的缓存值key
 * @param storageType 需要删除的缓存类型
 * @param options 配置项
 *
 * @description
 * 删除缓存值。
 * 默认删除 sessionStorage。
 * 预保留了 __all__、__all_sessionStorage__、__all_localStorage__ 三个 key，
 * 分别代表清空所有缓存、清空 sessionStorage 缓存、清空 localStorage 缓存。
 *
 * @example
 * removeStorage('__all__', 'all') // 清空所有缓存
 * removeStorage('__all_sessionStorage__', 'sessionStorage') // 清空 sessionStorage 缓存
 * removeStorage('__all_localStorage__', 'localStorage') // 清空 localStorage 缓存
 * removeStorage('signing', 'sessionStorage' || 'localStorage') // 清空 session 或者 localStorage 中 signing 缓存字段
 */
const removeStorage: RemoveStorageFC = (key, storageType, options) => {
  if (!key) {
    console.error('[removeStorage]: Failed to remove stored data: key is empty')

    return
  }

  const prefixedKey = getKeyWithPrefix(key, options)
  const localStorage = window.localStorage
  const sessionStorage = window.sessionStorage

  /**
   * @param storage 存储实例
   */
  const removeFromStorage = (storage: Storage) => {
    Object.keys(storage).forEach((k) =>
      storage.removeItem(getKeyWithPrefix(k, options)),
    )
  }

  switch (key) {
    case '__all__':
      removeFromStorage(localStorage)
      removeFromStorage(sessionStorage)

      break

    case '__all_sessionStorage__':
      removeFromStorage(sessionStorage)

      break

    case '__all_localStorage__':
      removeFromStorage(localStorage)

      break

    default:
      getStorageInstance(storageType as StorageLike).removeItem(prefixedKey)
  }
}

export { setStorage, getStorage, removeStorage, hasStorage }
