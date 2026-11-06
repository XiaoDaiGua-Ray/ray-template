import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export interface FormatOption {
  format?: string
}

export interface DateRange {
  start: dayjs.ConfigType
  end: dayjs.ConfigType
}

export interface StartAndEndOfDay {
  today: dayjs.Dayjs
  startOfDay: dayjs.Dayjs
  endOfDay: dayjs.Dayjs
  formatToday: string
  formatStartOfDay: string
  formatEndOfDay: string
}

const defaultDayjsFormat = 'YYYY-MM-DD HH:mm:ss'

/**
 *
 * @param locales 应用语言键到 Day.js locale 的映射
 * @param fallback 未知语言键使用的 Day.js locale
 * @param legacyGlobalLocale 是否兼容应用共享的 Day.js 全局语言
 *
 * @description
 * 日期格式化使用本地时区；兼容模式沿用 Day.js 全局语言。
 *
 * @returns 日期格式化、比较、范围与语言设置方法。
 */
export const createDayjsTools = <T extends string>(
  locales: Record<T, string>,
  fallback: string,
  legacyGlobalLocale = false,
) => {
  let currentLocale = fallback
  const at = (value?: dayjs.ConfigType) =>
    legacyGlobalLocale ? dayjs(value) : dayjs(value).locale(currentLocale)
  /**
   *
   * @param key 当前语言
   *
   * @description
   * 手动配置 dayjs 语言（国际化）。
   */
  const locale = (key: T) => {
    currentLocale = locales[key] ?? fallback

    if (legacyGlobalLocale) dayjs.locale(currentLocale)
  }

  /**
   *
   * @param d 待校验参数
   *
   * @description
   * 校验是否为 dayjs 对象。
   */
  const isDayjs = (d: unknown) => {
    return dayjs.isDayjs(d)
  }

  /**
   *
   * @param date 待格式化参数
   * @param formatOption 格式化配置项
   *
   * @description
   * 格式化日期。
   */
  const format = (date: dayjs.ConfigType, formatOption?: FormatOption) => {
    const { format = defaultDayjsFormat } = formatOption ?? {}

    return at(date).format(format)
  }

  /**
   *
   * @param formatOption 格式化配置项
   *
   * @description
   * 获取当前日期的开始和结束时间。
   *
   * 会返回当前日期、当前日期的开始时间和结束时间（未格式化与格式化后的）。
   */
  const getStartAndEndOfDay = (
    formatOption?: FormatOption,
  ): Readonly<StartAndEndOfDay> => {
    const { format = defaultDayjsFormat } = formatOption ?? {}
    const today = at()
    const startOfDay = today.startOf('day')
    const endOfDay = today.endOf('day')
    const formatToday = today.format(format)
    const formatStartOfDay = startOfDay.format(format)
    const formatEndOfDay = endOfDay.format(format)

    return {
      today,
      startOfDay,
      endOfDay,
      formatToday,
      formatStartOfDay,
      formatEndOfDay,
    } as const
  }

  /**
   *
   * @param date1 待计算日期
   * @param date2 待计算日期
   *
   * @description
   * 计算两天日期天数差异。
   *
   * 返回正数: date2 比 date1 晚。
   * 返回负数: date2 比 date1 早。
   * 返回零（0）: date2 等于 date1。
   */
  const daysDiff = (date1: dayjs.ConfigType, date2: dayjs.ConfigType) => {
    const start = at(date1)
    const end = at(date2)

    return end.diff(start, 'days')
  }

  /**
   *
   * @param date 待比较时间
   * @param range 起止时间
   *
   * @returns 时间是否落在开区间内，等于端点时返回 false。
   */
  const isDateInRange = (date: dayjs.ConfigType, range: DateRange): boolean => {
    const { start, end } = range
    const currentDate = at(date)

    return currentDate.isAfter(start) && currentDate.isBefore(end)
  }

  return {
    locale,
    getStartAndEndOfDay,
    format,
    isDayjs,
    daysDiff,
    isDateInRange,
  }
}

export type UseDayjsReturnType = ReturnType<typeof createDayjsTools>
