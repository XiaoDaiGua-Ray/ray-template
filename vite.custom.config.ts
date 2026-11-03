import { fileURLToPath, URL } from 'node:url'
import type { AppConfigExport } from '@/types/modules/vite-custom-config'
import type { BuildOptions } from 'vite'
import { PRE_LOADING_CONFIG } from './src/app-config/app-config.ts'
import { APP_THEME } from './src/app-config/design-config.ts'
import { mixinCss } from './vite-helper/index.ts'

const config: AppConfigExport = {
  // 是否使用 jsDelivr 的精确 npm 版本构建（默认离线可用的本地 bundle）
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

  // 配置 HMR 特定选项（端口、主机、路径和协议）
  server: {
    host: '127.0.0.1',
    port: 9527,
    open: false,
    strictPort: false,
    watch: {
      ignored: ['**/dist/**', '**/.ai-local/**', '**/.harness-local/**'],
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
    const outDir = `dist/${mode}`

    return mode === 'production'
      ? {
          outDir,
          sourcemap: false,
        }
      : {
          outDir,
          sourcemap: true,
        }
  },

  /**
   *
   * @description
   * 预设别名:
   * - @: src 根目录
   * - @api: src/api 根目录
   * - @images: src/assets/images 根目录
   * - @mock: mock 根目录
   */
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
    '@images': fileURLToPath(new URL('./src/assets/images', import.meta.url)),
    '@mock': fileURLToPath(new URL('./mock', import.meta.url)),
  },
}

export default config
