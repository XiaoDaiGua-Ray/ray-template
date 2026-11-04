import type { RemoveStorageFC, StorageLike, StorageOptions } from '@/types'
import { prefixCacheKey } from './app/prefix-cache-key'
import { getStorageInstance } from './cache-backend'

const getKeyWithPrefix = (key: string, options?: StorageOptions): string =>
  options?.prefix
    ? prefixCacheKey(key, { customPrefix: options.prefixKey })
    : key

/**
 *
 * @param key 缓存键
 * @param storageType 存储区域，默认 sessionStorage
 * @param options 键前缀配置
 *
 * @returns 键是否存在；浏览器拒绝访问存储时返回 false。
 */
function hasStorage(
  key: string,
  storageType: StorageLike = 'sessionStorage',
  options?: StorageOptions,
) {
  try {
    return (
      getStorageInstance(storageType).getItem(
        getKeyWithPrefix(key, options),
      ) !== null
    )
  } catch {
    return false
  }
}

/**
 *
 * @param key 非空缓存键
 * @param value 可序列化为 JSON 的值
 * @param storageType 存储区域，默认 sessionStorage
 * @param options 键前缀配置
 *
 * @description
 * 写入 JSON；键为空、值不可序列化或浏览器拒绝写入时记录错误。
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

  try {
    const data = JSON.stringify(value)

    if (data === void 0) throw new TypeError('Value is not JSON serializable.')

    getStorageInstance(storageType).setItem(
      getKeyWithPrefix(key, options),
      data,
    )
  } catch (error) {
    console.error(
      `[setStorage]: Failed to set stored data for key '${key}'`,
      error,
    )
  }
}

/**
 *
 * @param key 缓存键
 * @param storageType 存储区域，默认 sessionStorage
 * @param options 键前缀与回退值配置
 *
 * @returns JSON 值；键不存在、内容损坏或无法读取时返回回退值或 null。
 */
function getStorage<T = unknown>(
  key: string,
  storageType: StorageLike = 'sessionStorage',
  options?: StorageOptions<T>,
): T | null {
  const fallback = options?.defaultValue ?? null

  try {
    const data = getStorageInstance(storageType).getItem(
      getKeyWithPrefix(key, options),
    )

    return data === null ? fallback : (JSON.parse(data) as T)
  } catch (error) {
    console.error(
      `[getStorage]: Failed to get stored data for key '${key}'`,
      error,
    )

    return fallback
  }
}

/**
 *
 * @param key 缓存键，或批量删除标识 __all__、__all_sessionStorage__、__all_localStorage__
 * @param storageType 目标存储区域；批量删除时由标识决定
 * @param options 键前缀配置；批量删除时只清理符合前缀的键
 *
 * @description
 * 删除缓存；浏览器拒绝操作时记录错误。
 */
const removeStorage: RemoveStorageFC = (key, storageType, options) => {
  if (!key) {
    console.error('[removeStorage]: Failed to remove stored data: key is empty')

    return
  }

  const remove = (type: StorageLike, all = false) => {
    try {
      const storage = getStorageInstance(type)

      if (!all) {
        storage.removeItem(getKeyWithPrefix(key, options))

        return
      }

      const prefix = getKeyWithPrefix('', options)

      if (!prefix) {
        storage.clear()

        return
      }

      for (let index = storage.length - 1; index >= 0; index--) {
        const storedKey = storage.key(index)

        if (storedKey?.startsWith(prefix)) storage.removeItem(storedKey)
      }
    } catch (error) {
      console.error(
        `[removeStorage]: Failed to remove stored data for key '${key}'`,
        error,
      )
    }
  }

  switch (key) {
    case '__all__':
      remove('localStorage', true)
      remove('sessionStorage', true)
      break
    case '__all_sessionStorage__':
      remove('sessionStorage', true)
      break
    case '__all_localStorage__':
      remove('localStorage', true)
      break
    default:
      remove(storageType === 'localStorage' ? 'localStorage' : 'sessionStorage')
  }
}

export { setStorage, getStorage, removeStorage, hasStorage }
