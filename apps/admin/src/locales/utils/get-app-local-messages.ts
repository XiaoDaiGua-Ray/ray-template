import type {
  AppCurrentAppMessages,
  AppLocalesDropdownMixedOption,
  AppLocalesModules,
} from '@/locales/types'

const locales = import.meta.glob<AppLocalesModules['default']>('../lang/*.ts', {
  eager: true,
  import: 'default',
})

/**
 *
 * @param localOptions 语言包下拉配置项
 *
 * @description
 * 获取当前应用的所有语言包。
 *
 * @example
 * const messages = getAppLocalMessages(localOptions)
 */
export const getAppLocalMessages = (
  localOptions: AppLocalesDropdownMixedOption[],
) => {
  const entries = localOptions.map(({ key }) => {
    const locale = locales[`../lang/${key}.ts`]

    if (!locale) throw new Error(`Unknown locale: ${key}`)

    return [key, locale.message] as const
  })

  return Object.fromEntries(entries) as AppCurrentAppMessages
}
