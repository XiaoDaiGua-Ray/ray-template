import type { GlobalThemeOverrides } from 'naive-ui'
import type { Placement } from '@/types/modules/component'

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
}
