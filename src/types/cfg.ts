import type { VNodeChild } from 'vue'
import type {
  ServerOptions,
  BuildOptions,
  AliasOptions,
  UserConfigExport,
} from 'vite'

export interface LayoutSideBarLogo {
  icon?: string
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
  server: ServerOptions
  buildOptions: (mode: string) => BuildOptions
  alias: AliasOptions
  title: HTMLTitle
  copyright?: LayoutCopyright
  sideBarLogo?: LayoutSideBarLogo
  mixinCSS?: string
  rootRoute?: RootRoute
  preloadingConfig?: PreloadingConfig
  base?: string
  appPrimaryColor?: AppPrimaryColor
}

export type Recordable<T = unknown> = Record<string, T>

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
    sideBarLogo?: LayoutSideBarLogo
  }
  rootRoute: RootRoute
  base?: string
  appPrimaryColor: AppPrimaryColor
}

export type AppConfigExport = Config & UserConfigExport
