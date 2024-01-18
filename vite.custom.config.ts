/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-06
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 系统配置文件入口
 *
 * 配置范围:
 *   - 构建: 开发构建、打包构建、预览构建、体积分析构建等
 *   - 系统: 根路由、标题、浏览器标题、别名等
 *   - 请求: 代理配置
 *
 * 如果需要新增相关内容, 需要在 src/types/modules/viteCustomConfig.ts 中进行类型配置
 * ```
 * interface Config // config 内容类型配置
 *
 * interface AppConfig // __APP_CFG__ 内容配置
 * ```
 *
 * __APP_CFG__ 说明
 * ```
 * 该属性是用于全局注入的配置方法
 *
 * const { appPrimaryColor } = __APP_CFG__
 *
 * 以上例子展示, 从 __APP_CFG__ 中解构取出 appPrimaryColor 根路由配置信息
 * __APP_CFG__ 会被挂载于全局变量 `window` 下(vite define 默认是挂载于 window 下)
 * ```
 */

import path from 'node:path'

import { htmlTitlePlugin, mixinCSSPlugin } from './vite-plugins/index'
import { APP_THEME } from './src/app-config/designConfig'
import { PRE_LOADING_CONFIG, SIDE_BAR_LOGO } from './src/app-config/appConfig'

import type { AppConfigExport } from '@/types'
import type { BuildOptions } from 'vite'

const config: AppConfigExport = {
  /** 公共基础路径配置, 如果为空则会默认以 '/' 填充 */
  base: '/ray-template/',
  /** 配置首屏加载信息 */
  preloadingConfig: PRE_LOADING_CONFIG,
  /** 默认主题色(不可省略, 必填), 也用于 ejs 注入 */
  appPrimaryColor: APP_THEME.appPrimaryColor,
  sideBarLogo: SIDE_BAR_LOGO,
  /**
   *
   * 预处理全局需要注入的 css 文件
   *
   * 预设:
   *   - ./src/styles/mixins.scss
   *   - ./src/styles/setting.scss
   *   - ./src/styles/theme.scss
   *
   * 如果需要删除或者修改, 需要同步修改目录下的 css 文件
   */
  mixinCSS: mixinCSSPlugin([
    './src/styles/mixins.scss',
    './src/styles/setting.scss',
  ]),
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
  title: htmlTitlePlugin(PRE_LOADING_CONFIG.title || 'Ray Template'),
  /**
   *
   * 配置 HMR 特定选项(端口、主机、路径和协议)
   */
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
  /**
   *
   * 打包相关配置
   */
  buildOptions: (mode: string): BuildOptions => {
    const outDirMap = {
      test: 'dist/test-dist',
      development: 'dist/development-dist',
      production: 'dist/production-dist',
      report: 'dist/report-dist',
    }
    const dirPath = outDirMap[mode] || 'dist/test-dist'

    if (mode === 'production') {
      return {
        outDir: dirPath,
        sourcemap: false,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }
    } else {
      return {
        outDir: dirPath,
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: false,
            drop_debugger: false,
          },
        },
      }
    }
  },
  /**
   *
   * 预设别名
   * - `@`: `src` 根目录
   * - `@api`: `src/axios/api` 根目录
   * - `@images`: `src/assets/images` 根目录
   */
  alias: [
    {
      find: '@',
      replacement: path.resolve(__dirname, './src'),
    },
    {
      find: '@api',
      replacement: path.resolve(__dirname, './src/axios/api'),
    },
    {
      find: '@images',
      replacement: path.resolve(__dirname, './src/assets/images'),
    },
    {
      find: '@mock',
      replacement: path.resolve(__dirname, './mock'),
    },
  ],
}

export default config
