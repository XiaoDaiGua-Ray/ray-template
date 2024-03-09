import type {
  AppLocalesModules,
  AppLocalesDropdownMixedOption,
  AppCurrentAppMessages,
} from '@/locales/types'

/**
 *
 * @param localOptions 语言包下拉配置项
 *
 * @description
 * 获取当前应用的所有语言包。
 *
 * @example
 * const messages = await getAppLocalMessages(localOptions)
 */
export const getAppLocalMessages = async (
  localOptions: AppLocalesDropdownMixedOption[],
) => {
  const message = {} as AppCurrentAppMessages

  for (const curr of localOptions) {
    const msg: AppLocalesModules = await import(`@/locales/lang/${curr.key}.ts`)
    const key = curr.key

    if (key) {
      message[key] = msg?.default?.message ?? {}
    }
  }

  return message
}
