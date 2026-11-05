import type { IconName } from '@/icons/manifest'
import type { GlobalThemeOverrides } from 'naive-ui'
import type {
  AliasOptions,
  BuildOptions,
  ServerOptions,
  UserConfigExport,
} from 'vite'
import type { VNode, VNodeChild } from 'vue'
import type { Recordable } from './helper'

export interface LayoutSideBarLogo {
  icon?: IconName | VNode
  title?: string
  url?: string
  jumpType?: 'station' | 'outsideStation'
}

export type LayoutCopyright = string | number | VNodeChild

export interface RootRoute {
  name: string
  path: string
}

export interface PreloadingConfig {
  title?: string
}

export interface AppPrimaryColor {
  primaryColor: string
  primaryFadeColor: string
}

export interface Config {
  cdn: boolean
  server: ServerOptions
  buildOptions: (mode: string) => BuildOptions
  alias: AliasOptions
  copyright?: LayoutCopyright
  mixinCSS?: string
  preloadingConfig?: PreloadingConfig
  base?: string
  appPrimaryColor?: AppPrimaryColor
}

/**
 *
 * 全局注入配置
 *
 * 使用示例:
 * const { layout } = __APP_CFG__
 */
export interface AppConfig {
  pkg: {
    name: string
    version: string
    dependencies: Recordable<string>
    devDependencies: Recordable<string>
  }
  layout: {
    copyright?: LayoutCopyright
  }
  base?: string
  appPrimaryColor: AppPrimaryColor
}

export type AppConfigExport = Config & UserConfigExport

export interface AppTheme {
  appThemeColors: string[]
  appPrimaryColor: AppPrimaryColor
  appNaiveUIThemeOverrides: {
    dark: GlobalThemeOverrides
    light: GlobalThemeOverrides
  }
  echartTheme: string
}
