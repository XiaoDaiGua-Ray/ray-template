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
  const defaultBuild = buildOptions(mode)

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
    plugins: [
      vitePlugins(mode),
      mode === 'production' && {
        name: 'ray:clean-production-output',
        apply: 'build' as const,
        config({ build, environments }) {
          const client = environments?.client?.build

          // 只清理项目默认产物，保留对自定义输出目录的 Vite 默认保护。
          if (
            (client?.outDir ?? build?.outDir) === defaultBuild.outDir &&
            client?.emptyOutDir == null &&
            build?.emptyOutDir == null
          ) {
            return {
              environments: { client: { build: { emptyOutDir: true } } },
            }
          }
        },
      },
    ],
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
      ...defaultBuild,
      target: 'baseline-widely-available',
      rolldownOptions: {
        input: {
          index: fileURLToPath(
            new URL('./apps/admin/index.html', import.meta.url),
          ),
          example: fileURLToPath(
            new URL('./apps/admin/example.html', import.meta.url),
          ),
        },
        output: {
          // 只归并共用的框架与工具代码，图表渲染器随图表页加载。
          codeSplitting: {
            groups: [
              {
                name: 'app-framework',
                test: /[\\/]node_modules[\\/](?:vue|vue-router|vue-i18n|pinia|@vue[\\/](?:runtime-core|runtime-dom|reactivity|shared))[\\/]/,
                priority: 20,
              },
              {
                name: 'lodash-shared',
                test: /[\\/]node_modules[\\/]lodash-es[\\/]/,
                minShareCount: 2,
                priority: 10,
              },
              {
                name: 'chart-renderer',
                test: /[\\/]node_modules[\\/]zrender[\\/]/,
              },
            ],
          },
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
      ...(process.env.RAY_API_PROXY_TARGET
        ? { proxy: { '/api/': { target: process.env.RAY_API_PROXY_TARGET } } }
        : {}),
    },
  }
})
