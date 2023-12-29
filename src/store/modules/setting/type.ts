import type { GlobalThemeOverrides } from 'naive-ui'
import type { Placement } from '@/types'

export interface WatermarkConfig {
  content: string
  fontSize: number
  lineHeight: number
  width: number
  height: number
  xOffset: number
  yOffset: number
  rotate: number
}

export interface AppRootRoute {
  name: string
  path: string
}

export interface SettingState {
  drawerPlacement: Placement
  primaryColorOverride: GlobalThemeOverrides
  appTheme: boolean
  menuTagSwitch: boolean
  breadcrumbSwitch: boolean
  localeLanguage: string
  lockScreenSwitch: boolean
  watermarkSwitch: boolean
  copyrightSwitch: boolean
  contentTransition: string
  watermarkConfig: WatermarkConfig
  appRootRoute: AppRootRoute
}
