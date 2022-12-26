import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const pkg = require('./package.json')

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
}

import {
  useAliasOptions,
  useViteBuildPlugin,
  useViteServerPlugin,
  useEnvBuildOutput,
  useAutoImport,
  useViteComponents,
  useViteCompression,
  useVueI18nPlugin,
  useHTMLTitlePlugin,
  useSVGIcon,
} from './vite-plugin/index'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import ViteInspect from 'vite-plugin-inspect'
import viteSvgLoader from 'vite-svg-loader'
import viteEslintPlugin from 'vite-plugin-eslint'
import vitePluginImp from 'vite-plugin-imp' // 按需打包工具

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const { buildOptions } = useEnvBuildOutput(mode)

  return {
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    resolve: {
      alias: useAliasOptions(),
    },
    plugins: [
      vue({ reactivityTransform: true }),
      vueJsx(),
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
      useHTMLTitlePlugin(),
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
    ],
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
    },
    build: {
      ...useViteBuildPlugin(buildOptions),
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
      ...useViteServerPlugin(),
    },
  }
})
