import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

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
} from './vite-plugin/index'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import ViteInspect from 'vite-plugin-inspect'
import viteSvgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const { buildOptions } = useEnvBuildOutput(mode)

  return {
    resolve: {
      alias: useAliasOptions(),
    },
    plugins: [
      vue({ reactivityTransform: true }),
      vueJsx(),
      ViteInspect(), // 仅适用于开发模式(检查 Vite 插件的中间状态)
      VueI18nPlugin(),
      useAutoImport(),
      useViteComponents(),
      useViteCompression(),
      useVueI18nPlugin(),
      useHTMLTitlePlugin(),
      viteSvgLoader(),
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
          additionalData: '@import "./src/styles/mixins.scss";', // 全局mixin
        },
      },
    },
    server: {
      ...useViteServerPlugin(),
    },
  }
})
