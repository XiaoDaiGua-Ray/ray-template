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
