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
  const locale = (key: DayjsLocal) => {
    const mapkey = DAYJS_LOCAL_MAP[key]

    mapkey ? dayjs.locale(mapkey) : dayjs.locale(DEFAULT_DAYJS_LOCAL)
  }

  return {
    locale,
  }
}
