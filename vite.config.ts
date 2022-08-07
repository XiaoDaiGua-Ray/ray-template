import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import {
  useAutoImport,
  useViteComponents,
  useAliasOptions,
  useViteCompression,
  useVueI18nPlugin,
  useHTMLTitlePlugin,
  useViteBuildPlugin,
  useCreateSvgIconsPlugin,
  useViteServerPlugin,
} from './vite-plugin/index'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import ViteInspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    resolve: {
      alias: useAliasOptions(),
    },
    plugins: [
      vue({ reactivityTransform: true }),
      vueJsx(),
      await useAutoImport(),
      await useViteComponents(),
      useViteCompression(),
      VueI18nPlugin(),
      ViteInspect(), // 仅适用于开发模式(检查 Vite 插件的中间状态)
      useVueI18nPlugin(),
      useHTMLTitlePlugin(),
      useCreateSvgIconsPlugin(),
    ],
    optimizeDeps: {
      // include: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
    },
    build: {
      ...useViteBuildPlugin(),
      rollupOptions: {
        external: 'virtual:svg-icons-register',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/mixins.scss";', // 全局mixin
        },
      },
    },
    server: {
      ...useViteServerPlugin(),
    },
  }
})
