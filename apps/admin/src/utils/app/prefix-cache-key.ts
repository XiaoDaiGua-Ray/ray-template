import { APP_CATCH_KEY_PREFIX } from '@/app-config'

export interface PrefixCacheKeyOptions {
  customPrefix?: string
}

/**
 *
 * @param key 原始缓存键
 * @param options 可覆盖默认前缀；前缀需包含所需分隔符
 *
 * @returns 直接拼接前缀和原始键后的结果。
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
