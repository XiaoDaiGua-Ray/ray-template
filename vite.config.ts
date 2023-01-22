import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import {
  useAutoImport,
  useViteComponents,
  useVueI18nPlugin,
  useSVGIcon,
} from './vite-plugin/index'

import ViteVueJSX from '@vitejs/plugin-vue-jsx'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import ViteInspect from 'vite-plugin-inspect'
import viteSvgLoader from 'vite-svg-loader'
import viteEslintPlugin from 'vite-plugin-eslint'
import vitePluginImp from 'vite-plugin-imp' // 按需打包工具
import { visualizer } from 'rollup-plugin-visualizer' // 打包体积分析工具
import viteCompression from 'vite-plugin-compression' // 压缩打包

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers' // 模板自动导入组件并且按需打包

import config from './cfg'
import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg
const { server, buildOptions, alias, title, copyright, sideBarLogo } = config

/**
 *
 * 全局注入 `__APP_CFG__` 变量
 *
 * 可以在 `views` 页面使用
 *
 * 使用方法 `const { pkg, layout } = __APP_CFG__`
 *
 * 如果有新的补充, 需要自己手动补充类型 `src/types/cfg.ts AppConfig`
 */
const __APP_CFG__ = {
  pkg: { dependencies, devDependencies, name, version },
  layout: {
    copyright,
    sideBarLogo,
  },
}

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
      ViteVueJSX(),
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
      viteCompression(),
      useVueI18nPlugin(),
      viteSvgLoader({
        defaultImport: 'component', // 默认以 `componetn` 形式导入 `svg`
      }),
      useSVGIcon(),
      viteEslintPlugin({
        lintOnStart: true, // 构建时自动检查
        failOnWarning: true, // 如果含有警告则构建失败
        failOnError: true, // 如果有错误则构建失败
        cache: true, // 缓存, 减少构建时间
        exclude: ['**/node_modules/**', 'vite-env.d.ts'],
        include: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.tsx'],
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
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "./src/styles/mixins.scss"; @import "./src/styles/setting.scss";', // 全局 `mixin`
        },
      },
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    server: {
      ...server,
    },
  }
})
