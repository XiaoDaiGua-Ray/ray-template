import type {
  DayjsLocalMap,
  LocalOptions,
  TemplateLocale,
  ValueOf,
} from '@/types'

/**
 *
 * 语言包语种添加后, 需要在此文件配置语言包
 * 该配置中的 key 也会影响 naiveLocales 方法, 配置后请仔细核对一下
 *
 * 添加新的语言包后, 如果需要其类型提示, 需要在 AppCurrentAppMessages 中添加新的类型
 */
export const LOCAL_OPTIONS: LocalOptions = [
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
 * 模板默认语言
 *
 * 配置时应该与 LOCAL_OPTIONS 的 key 一致
 */
export const SYSTEM_DEFAULT_LOCAL: TemplateLocale<LocalOptions> = 'zh-CN'

/**
 *
 * 模板默认错误回滚语言
 *
 * 配置时应该与 LOCAL_OPTIONS 的 key 一致
 */
export const SYSTEM_FALLBACK_LOCALE: TemplateLocale<LocalOptions> = 'zh-CN'

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
} as const

/**
 *
 * dayjs 默认语言格式
 * 默认为英文(en)
 *
 * 系统默认设置为中文(大陆-简体)
 */
export const DEFAULT_DAYJS_LOCAL: ValueOf<typeof DAYJS_LOCAL_MAP> = 'zh-cn'
