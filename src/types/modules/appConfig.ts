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
