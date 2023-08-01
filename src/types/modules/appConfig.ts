import type { CreateAxiosDefaults } from 'axios'

export type CollapsedMode = 'transform' | 'width'

export interface AppMenuConfig {
  MENU_COLLAPSED_WIDTH: number
  MENU_COLLAPSED_MODE: CollapsedMode
  MENU_COLLAPSED_ICON_SIZE: number
  MENU_COLLAPSED_INDENT: number
  MENU_ACCORDION: boolean
}

export interface AppKeepAlive {
  setupKeepAlive: boolean
  keepAliveExclude?: string[]
  maxKeepAliveLength: number
}

export interface AxiosConfig extends Omit<CreateAxiosDefaults, 'cancelToken'> {}