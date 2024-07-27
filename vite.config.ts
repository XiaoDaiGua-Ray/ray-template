import { defineConfig } from 'vite'

import config from './vite.custom.config'
import pkg from './package.json'
import vitePlugins from './vite.plugin.config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { dependencies, devDependencies, name, version } = pkg
  const {
    server,
    buildOptions,
    alias,
    copyright,
    sideBarLogo,
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
      sideBarLogo,
    },
    appPrimaryColor,
  }

  return {
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
      include: [
        'vue',
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
        'currency.js',
        'mockjs',
      ],
    },
    esbuild: {
      pure: ['console.log'],
    },
    build: {
      ...buildOptions(mode),
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const isUtils = () => id.includes('src/utils/')
            const isHooks = () => id.includes('src/hooks/')
            const isNodeModules = () => id.includes('node_modules')
            const index = id.includes('pnpm') ? 1 : 0 // 兼容 pnpm, yarn, npm 包管理器差异

            if (isUtils()) {
              return 'utils'
            }

            if (isHooks()) {
              return 'hooks'
            }

            if (isNodeModules()) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')
                [index].toString()
            }
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
