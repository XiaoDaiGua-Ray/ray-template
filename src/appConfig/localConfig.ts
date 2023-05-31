/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-19
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** 国际化相关配置 */

import type { DayjsLocal, DayjsLocalMap } from '@/dayjs/type'

/**
 *
 * 语言包语种添加后, 需要在此文件配置语言包
 * 该配置中的 key 也会影响 naiveLocales 方法, 配置后请仔细核对一下
 */
export const LOCAL_OPTIONS = [
  {
    key: 'zh-CN',
    label: '中文(简体)',
  },
  {
    key: 'en-US',
    label: 'English(US)',
  },
]

/**
 *
 * 系统默认语言
 *
 * 配置时应该与 LOCAL_OPTIONS 的 key 一致
 */
export const SYSTEM_DEFAULT_LOCAL = 'zh-CN'

/**
 *
 * dayjs 默认语言格式
 * 默认为英文(en)
 *
 * 系统默认设置为中文(大陆-简体)
 */
export const DEFAULT_DAYJS_LOCAL: DayjsLocal = 'zh-cn'

/**
 *
 * i18n 国际化配置与 dayjs 配置的映射入口
 *
 * key 应该与 LOCAL_OPTIONS key 一致
 * 配置时请仔细检查
 */
export const DAYJS_LOCAL_MAP: DayjsLocalMap = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
}
