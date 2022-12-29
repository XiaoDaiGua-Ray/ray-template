import path from 'node:path'

import { HTMLTitlePlugin, buildOptions } from './vite-plugin/index'

import type { ServerOptions, BuildOptions, AliasOptions } from 'vite'

export interface HTMLTitle {
  name: string
  transformIndexHtml: (title: string) => string
}

export interface Config {
  server: ServerOptions
  buildOptions: (mode: string) => BuildOptions
  alias: AliasOptions
  title: HTMLTitle
}

const config: Config = {
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
