/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-09-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import dayjs from 'dayjs'
import { DEFAULT_DAYJS_LOCAL, DAYJS_LOCAL_MAP } from '@/app-config'

export interface FormatOption {
  format?: string
}

export interface DateRange {
  start: dayjs.ConfigType
  end: dayjs.ConfigType
}

export type LocalKey = typeof DEFAULT_DAYJS_LOCAL

const defaultDayjsFormat = 'YYYY-MM-DD HH:mm:ss'

/**
 *
 * dayjs hook
 *
 * 说明:
 *   - locale: 切换 dayjs 语言配置
 */
export const useDayjs = () => {
  /**
   *
   * @param key 当前语言
   *
   * 手动配置 dayjs 语言（国际化）
   */
  const locale = (key: LocalKey) => {
    const locale = DAYJS_LOCAL_MAP[key]

    locale ? dayjs.locale(locale) : dayjs.locale(DEFAULT_DAYJS_LOCAL)
  }

  /**
   *
   * @param d 待校验参数
   *
   * @remark 校验是否为 dayjs 对象
   *
   * @example
   * isDayjs('2022-11-11') => false
   * isDayjs('1699687245973) => false
   * isDayjs(dayjs()) => true
   */
  const isDayjs = (d: unknown) => {
    return dayjs.isDayjs(d)
  }

  /**
   *
   * @param date 待格式化参数
   * @param formatOption 格式化配置项
   *
   * @remark 格式化日期
   *
   * @example
   * dayjs().format() => '2020-04-02T08:02:17-05:00'
   * dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') => 'YYYYescape 2019-01-25T00:00:00-02:00Z'
   * dayjs('2019-01-25').format('DD/MM/YYYY') => '25/01/2019'
   */
  const format = (date: dayjs.ConfigType, formatOption?: FormatOption) => {
    const { format = defaultDayjsFormat } = formatOption ?? {}

    return dayjs(date).format(format)
  }

  /**
   *
   * @param formatOption 格式化配置项
   *
   * @remark 获取当前日期的开始和结束时间
   *
   * 会返回当前日期、当前日期的开始时间和结束时间（未格式化与格式化后的）
   */
  const getStartAndEndOfDay = (formatOption?: FormatOption) => {
    const { format = defaultDayjsFormat } = formatOption ?? {}
    const today = dayjs()
    const startOfDay = today.startOf('day')
    const endOfDay = today.endOf('day')
    const formatToday = today.format(format)
    const formatStartOfDay = startOfDay.format(format)

    return {
      today,
      startOfDay,
      endOfDay,
      formatToday,
      formatStartOfDay,
    } as const
  }

  /**
   *
   * @param date1 待计算日期
   * @param date2 待计算日期
   *
   * @remark 计算两天日期天数差异
   *
   * 返回正数: date2 比 date1 晚
   * 返回负数: date2 比 date1 早
   * 返回零（0）: date2 等于 date1
   *
   * @example
   * daysDiff('2022-01-11', '2022-01-12') => 1
   * daysDiff('2021-01-11', '2022-01-12') => 366
   * daysDiff('2023-01-11', '2022-01-12') => -364
   */
  const daysDiff = (date1: dayjs.ConfigType, date2: dayjs.ConfigType) => {
    const start = dayjs(date1)
    const end = dayjs(date2)

    return end.diff(start, 'days')
  }

  /**
   *
   * @param date 待比较时间
   * @param range 待比较开始与结束时间
   *
   * 判断一个时间是否在 start date 与 end date 之间
   * 如果刚还是等于开始、结束时间，也会返回 false
   *
   * @example
   * isDateInRange('2023-01-16', { start: '2023-01-15', end: '2023-01-20' }) => true
   * isDateInRange('2023-01-15', { start: '2023-01-15', end: '2023-01-20' }) => false
   * isDateInRange('2023-01-20', { start: '2023-01-15', end: '2023-01-20' }) => false
   */
  const isDateInRange = (date: dayjs.ConfigType, range: DateRange): boolean => {
    const { start, end } = range
    const currentDate = dayjs(date)

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

export type UseDayjsReturnType = ReturnType<typeof useDayjs>
