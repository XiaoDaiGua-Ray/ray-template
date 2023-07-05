/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import dayjs from 'dayjs'
import { DEFAULT_DAYJS_LOCAL, DAYJS_LOCAL_MAP } from '@/appConfig/localConfig'
import 'dayjs/locale/zh-cn'

import type { DayjsLocal } from './type'

export const setupDayjs = () => {
  dayjs.locale(DEFAULT_DAYJS_LOCAL)
}

/**
 *
 * dayjs hook
 *
 * 说明:
 *   - locale: 切换 dayjs 语言配置
 */
export const useDayjs = () => {
  const locale = (key: DayjsLocal) => {
    const mapkey = DAYJS_LOCAL_MAP[key]

    mapkey ? dayjs.locale(mapkey) : dayjs.locale(DEFAULT_DAYJS_LOCAL)
  }

  return {
    locale,
  }
}
