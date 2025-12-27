import type { Recordable } from '@/types'
import type { GlobalThemeOverrides } from 'naive-ui'
import type {
  AliasOptions,
  BuildOptions,
  ServerOptions,
  UserConfigExport,
} from 'vite'
import type { VNode, VNodeChild } from 'vue'

export interface LayoutSideBarLogo {
  icon?: string | VNode
  title?: string
  url?: string
  jumpType?: 'station' | 'outsideStation'
}

export type LayoutCopyright = string | number | VNodeChild

export interface RootRoute {
  name: string
  path: string
}

export interface HTMLTitle {
  name: string
  transformIndexHtml: (title: string) => string
}

export interface PreloadingConfig {
  title?: string
  tagColor?: string
  titleColor?: string
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
  title: HTMLTitle
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
