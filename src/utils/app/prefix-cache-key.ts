import { APP_CATCH_KEY_PREFIX } from '@/app-config'

/**
 *
 * @param key pinia 缓存 key
 *
 * @returns 返回拼接后的缓存 key
 *
 * @description
 * 为缓存 key 添加前缀，以便于区分不同的缓存，避免缓存 key 冲突。
 *
 * @example
 * // 假设 APP_CATCH_KEY_PREFIX = 'ray-template:'
 *
 * prefixCacheKey('signing') // 返回 'ray-template:signing'
 */
export const prefixCacheKey = (key: string) => {
  if (['', false, null, void 0].includes(key)) {
    return key
  }

  return `${APP_CATCH_KEY_PREFIX}${key}`
}
