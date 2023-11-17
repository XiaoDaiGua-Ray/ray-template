import type { CreateAxiosDefaults } from 'axios'

export type CollapsedMode = 'transform' | 'width'

export interface AppMenuConfig {
  menuCollapsedWidth: number
  menuCollapsedMode: CollapsedMode
  menuCollapsedIconSize: number
  menuCollapsedIndent: number
  menuAccordion: boolean
}

export interface AppKeepAlive {
  setupKeepAlive: boolean
  keepAliveExclude?: string[]
  maxKeepAliveLength: number
}

export interface AxiosConfig extends Omit<CreateAxiosDefaults, 'cancelToken'> {}

/**
 *
 * 模板中英文切换下拉框数据
 * 指定明确类型，以便于获取准确的 key
 */
export type LocalOptions = Array<
  | {
      key: 'zh-CN'
      label: string
    }
  | {
      key: 'en-US'
      label: string
    }
>

/**
 *
 * 模板 dayjs 国际化切换映射数据
 * 指定明确类型，以便于获取准确的 value
 */
export type DayjsLocalMap = {
  'zh-CN': 'zh-cn'
  'en-US': 'en'
}

export type TemplateLocale<T extends LocalOptions> = T[number]['key']
