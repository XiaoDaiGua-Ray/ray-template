import path from 'node:path'

import { HTMLTitlePlugin, buildOptions } from './vite-plugin/index'

import type { AppConfigExport } from './src/types/cfg'

const config: AppConfigExport = {
  /**
   *
   * icon: LOGO 图标, 依赖 `RayIcon` 实现
   * title: LOGO 标题
   * url: 点击跳转地址, 如果不配置该属性, 则不会触发跳转
   * jumpType: 跳转类型（station: 项目内跳转, outsideStation: 新页面打开）
   *
   * 如果不设置该属性或者为空, 则不会渲染 LOGO
   */
  sideBarLogo: {
    icon: 'ray',
    title: 'Ray Template',
    url: '/dashboard',
    jumpType: 'station',
  },
  /**
   *
   * 版权信息
   *
   * 也可以当作页底设置, 看实际业务需求
   */
  copyright: 'Copyright © 2022-present Ray',
  /**
   *
   * 浏览器标题
   */
  title: HTMLTitlePlugin('ray template'),
  /**
   *
   * 配置 HMR 特定选项（端口、主机、路径和协议）
   */
  server: {
    host: '0.0.0.0',
    port: 9527,
    open: false,
    https: false,
    strictPort: false,
    fs: {
      strict: false,
      allow: [],
    },
    proxy: {
      '/api': {
        target: 'url',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  /**
   *
   * 打包相关配置
   */
  buildOptions: buildOptions,
  /**
   *
   * 预设别名
   * - `@`: `src` 根目录
   * - `@use-utils`: `src/utils` 根目录
   * - `@use-api`: `src/axios/api` 根目录
   * - `@use-images`: `src/assets/images` 根目录
   */
  alias: [
    {
      find: '@',
      replacement: path.resolve(__dirname, './src'),
    },
    {
      find: '@use-utils',
      replacement: path.resolve(__dirname, './src/utils'),
    },
    {
      find: '@use-api',
      replacement: path.resolve(__dirname, './src/axios/api'),
    },
    {
      find: '@use-images',
      replacement: path.resolve(__dirname, './src/assets/images'),
    },
  ],
}

export default config
