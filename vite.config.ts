import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import pkg from './apps/admin/package.json' with { type: 'json' }
import workspace from './package.json' with { type: 'json' }
import config from './vite.custom.config.ts'
import vitePlugins from './vite.plugin.config.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const { dependencies, name, version } = pkg
  const { devDependencies } = workspace
  const {
    server,
    buildOptions,
    alias,
    copyright,
    mixinCSS,
    appPrimaryColor,
    base,
  } = config

  const __APP_CFG__ = {
    pkg: {
      dependencies,
      devDependencies,
      name,
      version,
    },
    layout: {
      copyright,
    },
    appPrimaryColor,
  }

  return {
    root: fileURLToPath(new URL('./apps/admin', import.meta.url)),
    base: base || '/',
    define: {
      __APP_CFG__: JSON.stringify(__APP_CFG__),
      __DEV__: mode === 'development',
    },
    resolve: {
      alias: alias,
    },
    plugins: vitePlugins(mode),
    optimizeDeps: {
      entries: ['index.html'],
      include: [
        'vue',
        'vue-demi',
        'vue-router',
        'pinia',
        'vue-i18n',
        'naive-ui',
        '@vueuse/core',
        'dayjs',
        'echarts',
        'axios',
        'print-js',
        'clipboard',
        'lodash-es',
        'vue-hooks-plus',
        'interactjs',
        'pinia-plugin-persistedstate',
        '@faker-js/faker/locale/zh_CN',
      ],
    },
    build: {
      ...buildOptions(mode),
      target: 'baseline-widely-available',
      rolldownOptions: {
        output: {
          // 交由 Rolldown 按依赖图拆包，避免手动按 pnpm 目录分组造成循环依赖。
          minify: {
            compress: {
              dropConsole: mode === 'production',
              dropDebugger: mode === 'production',
            },
          },
          assetFileNames: '[ext]/[name]-[hash][extname]',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
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
