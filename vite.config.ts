import { defineConfig } from 'vite'

import config from './cfg'
import pkg from './package.json'
import vitePlugins from './vite.pliugin.config'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
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
    pkg: { dependencies, devDependencies, name, version },
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
    },
    resolve: {
      alias: alias,
    },
    plugins: vitePlugins(mode),
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
              const index = id.includes('pnpm') ? 1 : 0

              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')
                [index].toString()
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
