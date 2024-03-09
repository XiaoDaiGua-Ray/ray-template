import { APP_CATCH_KEY_PREFIX } from '@/app-config'

export interface PrefixCacheKeyOptions {
  customPrefix?: string
}

/**
 *
 * @param key pinia 缓存 key
 *
 * @returns 返回拼接后的缓存 key
 *
 * @description
 * 为缓存 key 添加前缀，以便于区分不同的缓存，避免缓存 key 冲突。
 *
 * 默认使用 APP_CATCH_KEY_PREFIX 作为前缀。
 *
 * 当你需要自定义前缀时，可以传入 customPrefix，当 customPrefix 存在时，会使用 customPrefix 作为前缀。
 *
 * @example
 * // 假设 APP_CATCH_KEY_PREFIX = 'ray-template:'
 * prefixCacheKey('signing') // 返回 'ray-template:signing'
 *
 * // customPrefix 自定义前缀
 * prefixCacheKey('signing', { customPrefix: 'ray' }) // 返回 'ray:signing'
 */
export const prefixCacheKey = (
  key: string,
  options?: PrefixCacheKeyOptions,
) => {
  const { customPrefix } = options ?? {}

  if (customPrefix) {
    return `${customPrefix}${key}`
  }

  return `${APP_CATCH_KEY_PREFIX}${key}`
}
