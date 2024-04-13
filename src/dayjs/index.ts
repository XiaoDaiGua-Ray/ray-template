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
import { DEFAULT_DAYJS_LOCAL } from '@/app-config'
import 'dayjs/locale/zh-cn'

/**
 *
 * @description
 * vue 挂载之前初始化 dayjs。
 *
 * 初始化 dayjs 的语言环境。
 */
export const setupDayjs = () => {
  dayjs.locale(DEFAULT_DAYJS_LOCAL)
}
