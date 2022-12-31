import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import config from './cfg'
const pkg = require('./package.json')

const { dependencies, devDependencies, name, version } = pkg
const { server, buildOptions, alias, title, copyright, sideBarLogo } = config

const __APP_CFG__ = {
  pkg: { dependencies, devDependencies, name, version },
  layout: {
    copyright,
    sideBarLogo,
  },
}

import {
  useAutoImport,
  useViteComponents,
  useViteCompression,
  useVueI18nPlugin,
  useSVGIcon,
} from './vite-plugin/index'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import ViteInspect from 'vite-plugin-inspect'
import viteSvgLoader from 'vite-svg-loader'
import viteEslintPlugin from 'vite-plugin-eslint'
import vitePluginImp from 'vite-plugin-imp' // 按需打包工具
import { visualizer } from 'rollup-plugin-visualizer' // 打包体积分析工具

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  return {
    define: {
      __APP_CFG__: JSON.stringify(__APP_CFG__),
    },
    resolve: {
      alias: alias,
    },
    plugins: [
      vue({ reactivityTransform: true }),
      vueJsx(),
      title,
      ViteInspect(), // 仅适用于开发模式(检查 `Vite` 插件的中间状态)
      VueI18nPlugin(),
      await useAutoImport([
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ]),
      await useViteComponents([NaiveUiResolver()]),
      useViteCompression(),
      useVueI18nPlugin(),
      viteSvgLoader({
        defaultImport: 'component', // 默认以 `componetn` 形式导入 `svg`
      }),
      useSVGIcon(),
      viteEslintPlugin({
        failOnWarning: true, // 如果含有警告则构建失败
        failOnError: true, // 如果有错误则构建失败
        cache: true, // 缓存, 减少构建时间
        exclude: ['**/node_modules/**', 'vite-env.d.ts'],
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
      {
        include: [
          'src/**/*.ts',
          'src/**/*.tsx',
          'src/**/*.vue',
          'src/*.ts',
          'src/*.tsx',
          'src/*.vue',
        ],
      },
      visualizer({
        gzipSize: true, // 搜集 `gzip` 压缩包
        brotliSize: true, // 搜集 `brotli` 压缩包
        emitFile: false, // 生成文件在根目录下
        filename: 'visualizer.html',
        open: mode === 'report' ? true : false, // 以默认服务器代理打开文件
      }),
    ],
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
    },
    build: {
      ...buildOptions(mode),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "./src/styles/mixins.scss"; @import "./src/styles/setting.scss";', // 全局 `mixin`
        },
      },
    },
    server: {
      ...server,
    },
  }
})
