import { getStorage } from '@/utils'
import { APP_CATCH_KEY, SYSTEM_DEFAULT_LOCAL } from '@/app-config'

import type { AppCurrentAppMessages } from '@/locales/types'

/**
 *
 * @description
 * 获取当前应用的默认语言。
 *
 * @example
 * const language = getAppDefaultLanguage() // zh-CN | en-US | ...
 */
export const getAppDefaultLanguage = () => {
  const language = getStorage(APP_CATCH_KEY.localeLanguage, 'localStorage', {
    defaultValue: SYSTEM_DEFAULT_LOCAL,
  })

  return language as keyof AppCurrentAppMessages
}
