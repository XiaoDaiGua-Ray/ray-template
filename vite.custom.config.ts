import path from 'node:path'

import { htmlTitlePlugin, mixinCss } from './vite-helper'
import { APP_THEME } from './src/app-config/design-config'
import { PRE_LOADING_CONFIG } from './src/app-config/app-config'

import type { AppConfigExport } from '@/types'
import type { BuildOptions } from 'vite'

const config: AppConfigExport = {
  // 是否启用 cdn 构建项目
  cdn: false,

  // 公共基础路径配置, 如果为空则会默认以 '/' 填充
  base: '/ray-template/',

  // 配置首屏加载信息
  preloadingConfig: PRE_LOADING_CONFIG,

  // 默认主题色（不可省略，必填），也用于 ejs 注入
  appPrimaryColor: APP_THEME.appPrimaryColor,

  /**
   *
   * @description
   * 预处理全局需要注入的 css 文件。
   *
   * 预设:
   *   - ./src/styles/mixins.scss
   *   - ./src/styles/setting.scss
   *
   * 如果需要删除或者修改，需要同步修改目录下的 css 文件。
   */
  mixinCSS: mixinCss(['@/styles/mixins.scss', '@/styles/setting.scss']),

  // 版权信息
  copyright: 'Copyright © 2022-present Ray',

  // 浏览器标题
  title: htmlTitlePlugin(PRE_LOADING_CONFIG.title || 'Ray Template'),

  // 配置 HMR 特定选项（端口、主机、路径和协议）
  server: {
    host: '0.0.0.0',
    port: 9527,
    open: false,
    strictPort: false,
    fs: {
      strict: false,
      allow: [],
    },
    proxy: {
      '^/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 打包相关配置
  buildOptions: (mode: string): BuildOptions => {
    const productionBuildOptions = {
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }
    const defaultOptions = {
      sourcemap: true,
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false,
        },
      },
    }
    const outDir = `dist/${mode}`

    return mode === 'production'
      ? {
          ...productionBuildOptions,
          outDir,
        }
      : {
          ...defaultOptions,
          outDir,
        }
  },

  /**
   *
   * @description
   * 预设别名:
   * - @: src 根目录
   * - @api: src/axios/api 根目录
   * - @images: src/assets/images 根目录
   * - @mock: mock 根目录
   */
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@api': path.resolve(__dirname, './src/axios/api'),
    '@images': path.resolve(__dirname, './src/assets/images'),
    '@mock': path.resolve(__dirname, './mock'),
  },
}

export default config
