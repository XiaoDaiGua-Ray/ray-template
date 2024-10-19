import type { SettingState } from '@/store/modules/setting/types'

export const defaultSettingConfig: Partial<SettingState> = {
  contentTransition: 'scale',
  watermarkSwitch: false,
  keepAliveConfig: {
    maxKeepAliveLength: 10,
    setupKeepAlive: true,
  },
  menuConfig: {
    collapsedWidth: 64,
    collapsedMode: 'width',
    collapsedIconSize: 22,
    collapsedIndent: 24,
    accordion: false,
  },
  menuTagSwitch: true,
  breadcrumbSwitch: true,
  copyrightSwitch: true,
  drawerPlacement: 'right',
}
