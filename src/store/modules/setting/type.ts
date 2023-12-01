import type { GlobalThemeOverrides } from 'naive-ui'
import type { Placement } from '@/types/modules/component'
import type { APP_WATERMARK_CONFIG } from '@/app-config/appConfig'

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
  watermarkConfig: typeof APP_WATERMARK_CONFIG
}
