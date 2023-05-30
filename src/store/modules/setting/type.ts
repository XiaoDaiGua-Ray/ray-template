import type { GlobalThemeOverrides } from 'naive-ui'

export interface SettingState {
  drawerPlacement: NaiveDrawerPlacement
  primaryColorOverride: GlobalThemeOverrides
  themeValue: boolean
  reloadRouteSwitch: boolean
  menuTagSwitch: boolean
  spinSwitch: boolean
  breadcrumbSwitch: boolean
  localeLanguage: string
  invertSwitch: boolean
  lockScreenSwitch: boolean
  lockScreenInputSwitch: boolean
}
