/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-09-15
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import viteVueJSX from '@vitejs/plugin-vue-jsx'
import viteVeI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import viteInspect from 'vite-plugin-inspect'
import viteSvgLoader from 'vite-svg-loader'
import vitePluginImp from 'vite-plugin-imp'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { ViteEjsPlugin as viteEjsPlugin } from 'vite-plugin-ejs'
import viteAutoImport from 'unplugin-auto-import/vite'
import viteEslint from 'vite-plugin-eslint'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import unpluginViteComponents from 'unplugin-vue-components/vite'
import { cdn as viteCDNPlugin } from 'vite-plugin-cdn2'

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import config from './cfg'

import type { PluginOption } from 'vite'

// 仅适用于构建模式（任何构建模式：preview、build、report...）
function onlyBuildOptions(mode: string) {
  return [
    visualizer({
      gzipSize: true, // 搜集 `gzip` 压缩包
      brotliSize: true, // 搜集 `brotli` 压缩包
      emitFile: false, // 生成文件在根目录下
      filename: 'visualizer.html',
      open: mode === 'report' ? true : false, // 以默认服务器代理打开文件
    }),
    viteCDNPlugin({
      // modules 顺序 vue, vue-demi 必须保持当前顺序加载，否则会出现加载错误问题
      modules: [
        'vue',
        'vue-demi',
        'pinia',
        'naive-ui',
        'vue-router',
        'vue-i18n',
        'dayjs',
        'echarts',
        'xlsx',
        'axios',
        'print-js',
        'clipboard',
        'lodash-es',
      ],
    }),
  ]
}

// 仅适用于开发模式
function onlyDevOptions(mode: string) {
  return []
}

// 基础插件配置
function baseOptions(mode: string) {
  const { title, appPrimaryColor, preloadingConfig } = config

  return [
    vue(),
    viteVueJSX(),
    title,
    viteVeI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      forceStringify: true,
      defaultSFCLang: 'json',
      include: [path.resolve(__dirname, '../locales/**')],
    }),
    viteAutoImport({
      eslintrc: {
        enabled: true,
        filepath: './unplugin/.eslintrc-auto-import.json',
      },
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: './unplugin/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
      resolvers: [NaiveUiResolver()],
    }),
    unpluginViteComponents({
      dts: './unplugin/components.d.ts',
      resolvers: [NaiveUiResolver()],
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
    }),
    viteCompression(),
    viteSvgLoader({
      defaultImport: 'url', // 默认以 url 形式导入 svg
    }),
    viteEslint({
      lintOnStart: true,
      failOnError: true,
      failOnWarning: true,
      fix: true,
      exclude: ['dist/**', '**/node_modules/**', 'vite-env.d.ts', '*.md'],
      include: ['src/**/*.{vue,js,jsx,ts,tsx}'],
      cache: true,
    }),
    vitePluginImp({
      libList: [
        {
          libName: 'lodash-es',
          libDirectory: '',
          camel2DashComponentName: false,
        },
        {
          libName: '@vueuse',
          libDirectory: '',
          camel2DashComponentName: false,
        },
      ],
    }),
    viteEjsPlugin({
      preloadingConfig,
      appPrimaryColor,
    }),
    viteInspect(), // 仅适用于开发模式(检查 `Vite` 插件的中间状态)
    mockDevServerPlugin({
      include: ['mock/**/*.mock.ts'],
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/cypress/**',
        'src/**',
        '**/.vscode/**',
        '**/.git/**',
        '**/dist/**',
        'mock/shared/**',
      ],
      reload: true,
      build: true,
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ]
}

export default function (mode: string): PluginOption[] {
  const plugins =
    mode === 'development' ? onlyDevOptions(mode) : onlyBuildOptions(mode)

  return [...baseOptions(mode), ...plugins]
}
