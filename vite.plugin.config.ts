import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import viteVeI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import svgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
import vue from '@vitejs/plugin-vue'
import viteVueJSX from '@vitejs/plugin-vue-jsx'
import gzipPlugin from 'rollup-plugin-gzip'
import unoCSS from 'unocss/vite'
import viteAutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import unpluginViteComponents from 'unplugin-vue-components/vite'
import type { PluginOption } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import { cdn as viteCDNPlugin } from 'vite-plugin-cdn2'
import { ViteEjsPlugin as viteEjsPlugin } from 'vite-plugin-ejs'
import viteInspect from 'vite-plugin-inspect'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import viteSvgLoader from 'vite-svg-loader'
import { cdnResolve } from './vite-helper/index.ts'
import config from './vite.custom.config.ts'

// 仅适用于报告模式（report）
function onlyReportOptions(mode: string): PluginOption[] {
  if (mode !== 'report') {
    return []
  }

  return [
    analyzer({
      // 输出静态报告，适合终端与 CI
      analyzerMode: 'static',
      // 不自动打开浏览器
      openAnalyzer: false,
    }),
  ]
}

// 仅适用于构建模式（任何构建模式：preview、build、report...）
function onlyBuildOptions(mode: string): PluginOption[] {
  const { cdn } = config

  return [
    viteCDNPlugin({
      // modules 顺序 vue, vue-demi 必须保持当前顺序加载，否则会出现加载错误问题
      resolve: cdnResolve(),
      modules: cdn
        ? [
            {
              name: 'vue',
              global: 'Vue',
              relativeModule: 'dist/vue.global.prod.js',
            },
            {
              name: 'vue-demi',
              global: 'VueDemi',
              relativeModule: 'lib/index.iife.js',
            },
            {
              name: 'naive-ui',
              global: 'naive',
              relativeModule: 'dist/index.prod.js',
            },
            {
              name: 'pinia',
              global: 'Pinia',
              relativeModule: 'dist/pinia.iife.prod.js',
            },
            {
              name: 'vue-router',
              global: 'VueRouter',
              relativeModule: 'dist/vue-router.global.prod.js',
            },
            {
              name: 'vue-i18n',
              global: 'VueI18n',
              relativeModule: 'dist/vue-i18n.global.prod.js',
            },
            {
              name: 'echarts',
              global: 'echarts',
              relativeModule: 'dist/echarts.min.js',
            },
            {
              name: 'axios',
              global: 'axios',
              relativeModule: 'dist/axios.min.js',
            },
            {
              name: 'jsbarcode',
              global: 'JsBarcode',
              relativeModule: 'dist/JsBarcode.all.min.js',
            },
            {
              name: 'dayjs',
              global: 'dayjs',
              relativeModule: 'dayjs.min.js',
            },
            {
              name: 'print-js',
              global: 'printJS',
              relativeModule: 'dist/print.js',
            },
          ]
        : [],
    }),
  ]
}

// 仅适用于开发模式
function onlyDevOptions(mode: string): PluginOption[] {
  if (mode !== 'development') {
    return []
  }

  return []
}

// 开发、构建和单元测试共用 Vue/TSX 与自动导入转换。
function vueTransformPlugins(): PluginOption[] {
  return [
    vue(),
    viteVueJSX(),
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
      imports: ['vue', 'vue-router', 'pinia'],
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
  ]
}

// 基础插件配置
function baseOptions(mode: string): PluginOption[] {
  const { title, appPrimaryColor, preloadingConfig } = config

  return [
    ...vueTransformPlugins(),
    title,
    viteVeI18nPlugin({
      include: [
        resolve(
          dirname(fileURLToPath(import.meta.url)),
          './src/locales/lang/**/*.json',
        ),
      ],
    }),
    gzipPlugin(),
    viteSvgLoader({
      defaultImport: 'url', // 默认以 url 形式导入 svg
    }),

    viteEjsPlugin({
      preloadingConfig,
      appPrimaryColor,
    }),
    // 仅适用于开发模式(检查 `Vite` 插件的中间状态)
    viteInspect({
      dev: false,
    }),
    mockDevServerPlugin({
      dir: 'mock',
      include: ['**/*.mock.ts'],
      exclude: ['shared/**'],
      awaitInitialLoad: true,
      reload: true,
      build: true,
    }),
    svgSpritemap('./src/icons/**/*.svg', {
      prefix: 'icon-',
      output: { hrefAttribute: 'href' },
      svgo: false,
    }),
    unoCSS(),
  ]
}

export default function (mode: string): PluginOption[] {
  // 单元测试无需启动 mock 服务、HTML 注入、图标扫描或压缩输出。
  if (mode === 'test') {
    return vueTransformPlugins()
  }

  const plugins =
    mode === 'development' ? onlyDevOptions(mode) : onlyBuildOptions(mode)
  const reportPlugins = mode === 'report' ? onlyReportOptions(mode) : []

  return [...baseOptions(mode), ...plugins, ...reportPlugins]
}
