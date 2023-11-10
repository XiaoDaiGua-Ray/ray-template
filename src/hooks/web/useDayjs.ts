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
import { DEFAULT_DAYJS_LOCAL, DAYJS_LOCAL_MAP } from '@/app-config/localConfig'

import type { DayjsLocal } from '@/dayjs/type'

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
  const locale = (key: DayjsLocal) => {
    const locale = DAYJS_LOCAL_MAP[key]

    locale ? dayjs.locale(locale) : dayjs.locale(DEFAULT_DAYJS_LOCAL)
  }

  return {
    locale,
  }
}
