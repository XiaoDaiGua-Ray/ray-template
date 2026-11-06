export interface LocaleConfiguration {
  options: readonly { key: string }[]
  defaultLocale: string
  fallbackLocale: string
  dayjsLocales: Readonly<Record<string, string>>
  defaultDayjsLocale: string
}

/**
 *
 * @param config 语言选项、默认语言与 Day.js 映射的配置快照
 *
 * @description
 * 检查独立配置项之间的对应关系，不修改配置、不加载语言包，也不写入控制台。
 *
 * @returns 去重后的配置问题；配置一致时为空数组。
 */
export const getLocaleConfigIssues = (
  config: LocaleConfiguration,
): string[] => {
  const issues = new Set<string>()
  const locales = new Set<string>()

  for (const { key } of config.options) {
    if (locales.has(key))
      issues.add(`LOCAL_OPTIONS contains duplicate locale "${key}".`)

    locales.add(key)
  }

  for (const [name, locale] of [
    ['SYSTEM_DEFAULT_LOCAL', config.defaultLocale],
    ['SYSTEM_FALLBACK_LOCALE', config.fallbackLocale],
  ]) {
    if (!locales.has(locale))
      issues.add(`${name} "${locale}" is missing from LOCAL_OPTIONS.`)
  }

  for (const locale of locales) {
    if (!Object.hasOwn(config.dayjsLocales, locale))
      issues.add(
        `DAYJS_LOCAL_MAP is missing locale "${locale}" from LOCAL_OPTIONS.`,
      )
  }

  const dayjsLocales = new Set<string>()

  for (const [locale, dayjsLocale] of Object.entries(config.dayjsLocales)) {
    if (!locales.has(locale))
      issues.add(
        `DAYJS_LOCAL_MAP locale "${locale}" is missing from LOCAL_OPTIONS.`,
      )

    dayjsLocales.add(dayjsLocale)
  }

  if (!dayjsLocales.has(config.defaultDayjsLocale))
    issues.add(
      `DEFAULT_DAYJS_LOCAL "${config.defaultDayjsLocale}" is missing from DAYJS_LOCAL_MAP values.`,
    )

  return [...issues]
}
