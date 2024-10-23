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
    collapsedIconSize: 16,
    collapsedIndent: 24,
    accordion: false,
    menuSiderBarLogo: true,
    iconSize: 16,
  },
  menuTagSwitch: true,
  breadcrumbSwitch: true,
  copyrightSwitch: true,
  drawerPlacement: 'right',
}
