import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import {
  viteComponents,
  viteVueI18nPlugin,
  viteSVGIcon,
} from './vite-plugin/index'
import viteVueJSX from '@vitejs/plugin-vue-jsx'
import viteVeI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import viteInspect from 'vite-plugin-inspect'
import viteSvgLoader from 'vite-svg-loader'
import viteEslintPlugin from 'vite-plugin-eslint'
import vitePluginImp from 'vite-plugin-imp' // 按需打包工具
import { visualizer } from 'rollup-plugin-visualizer' // 打包体积分析工具
import viteCompression from 'vite-plugin-compression' // 压缩打包
import { ViteEjsPlugin as viteEjsPlugin } from 'vite-plugin-ejs'
import viteAutoImport from 'unplugin-auto-import/vite'

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers' // 模板自动导入组件并且按需打包
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers'

import config from './cfg'
import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg
const {
  server,
  buildOptions,
  alias,
  title,
  copyright,
  sideBarLogo,
  mixinCSS,
  appPrimaryColor,
  preloadingConfig,
  base,
} = config

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
  appPrimaryColor,
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  return {
    base: base || '/',
    define: {
      __APP_CFG__: JSON.stringify(__APP_CFG__),
    },
    resolve: {
      alias: alias,
    },
    plugins: [
      vue({ reactivityTransform: true }),
      viteVueJSX(),
      title,
      viteInspect(), // 仅适用于开发模式(检查 `Vite` 插件的中间状态)
      viteVeI18nPlugin({}),
      viteAutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        dts: true,
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          'vue-i18n',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
        ],
        resolvers: [NaiveUiResolver(), VueHooksPlusResolver()],
      }),
      await viteComponents([NaiveUiResolver(), VueHooksPlusResolver()]),
      viteCompression(),
      viteVueI18nPlugin(),
      viteSvgLoader({
        defaultImport: 'component', // 默认以 `componetn` 形式导入 `svg`
      }),
      viteSVGIcon(),
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
          {
            libName: 'lodash',
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
      viteEjsPlugin({
        preloadingConfig,
        appPrimaryColor,
      }),
    ],
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
    },
    esbuild: {
      pure: ['console.log'],
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
                .split('/')[1]
                .toString()
            }
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: mixinCSS,
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
