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
import { analyzer } from 'vite-bundle-analyzer'
import viteCompression from 'vite-plugin-compression'
import { ViteEjsPlugin as viteEjsPlugin } from 'vite-plugin-ejs'
import viteAutoImport from 'unplugin-auto-import/vite'
import viteEslint from 'vite-plugin-eslint'
import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import unpluginViteComponents from 'unplugin-vue-components/vite'
import { cdn as viteCDNPlugin } from 'vite-plugin-cdn2'

import { cdnResolve, svgIconResolve } from './vite-helper'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import config from './vite.custom.config'

import type { PluginOption } from 'vite'

// 仅适用于报告模式（report）
function onlyReportOptions(mode: string): PluginOption[] {
  if (mode !== 'report') {
    return []
  }

  return [
    analyzer({
      analyzerMode: 'server', // 以默认服务器代理打开文件
      openAnalyzer: true, // 以默认服务器代理打开文件
    }),
  ]
}

// 仅适用于构建模式（任何构建模式：preview、build、report...）
function onlyBuildOptions(mode: string): PluginOption[] {
  return [
    viteCDNPlugin({
      // modules 顺序 vue, vue-demi 必须保持当前顺序加载，否则会出现加载错误问题
      resolve: cdnResolve(),
      modules: [
        {
          name: 'vue',
          global: 'Vue',
          relativeModule: 'vue.global.min.js',
        },
        {
          name: 'vue-demi',
          global: 'VueDemi',
          relativeModule: 'index.iife.min.js',
        },
        {
          name: 'naive-ui',
          global: 'naive',
          relativeModule: 'index.prod.js',
        },
        {
          name: 'pinia',
          global: 'Pinia',
          relativeModule: 'pinia.iife.min.js',
        },
        {
          name: 'vue-router',
          global: 'VueRouter',
          relativeModule: 'vue-router.global.min.js',
        },
        {
          name: 'vue-i18n',
          global: 'VueI18n',
          relativeModule: 'vue-i18n.global.min.js',
        },
        {
          name: 'echarts',
          global: 'echarts',
          relativeModule: 'echarts.min.js',
        },
        {
          name: 'axios',
          global: 'axios',
          relativeModule: 'axios.min.js',
        },
      ],
    }),
  ]
}

// 仅适用于开发模式
function onlyDevOptions(mode: string): PluginOption[] {
  if (mode === 'development') {
    return []
  }

  return []
}

// 基础插件配置
function baseOptions(mode: string): PluginOption[] {
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
    // 基础插件配置，在 report 模式下不需要 eslint 插件
    mode !== 'report'
      ? viteEslint({
          lintOnStart: true,
          failOnError: true,
          failOnWarning: true,
          fix: true,
          exclude: ['dist/**', '**/node_modules/**', 'vite-env.d.ts', '*.md'],
          include: ['src/**/*.{vue,js,jsx,ts,tsx}'],
          cache: true,
        })
      : null,
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
      iconDirs: svgIconResolve(),
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ]
}

export default function (mode: string): PluginOption[] {
  const plugins =
    mode === 'development' ? onlyDevOptions(mode) : onlyBuildOptions(mode)
  const reportPlugins = mode === 'report' ? onlyReportOptions(mode) : []

  return [...baseOptions(mode), ...plugins, ...reportPlugins]
}
