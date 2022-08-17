import path from 'node:path'

import viteCompression from 'vite-plugin-compression' // 压缩打包
import AutoImport from 'unplugin-auto-import/vite' // 自动导入
import ViteComponents from 'unplugin-vue-components/vite' // 自动按需导入
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite' // i18n

import type { ComponentResolver, TypeImport } from 'unplugin-vue-components'
import type { VitePluginCompression } from './type'
import type { ImportsMap, PresetName } from 'unplugin-auto-import/types'
import type { ServerOptions, BuildOptions } from 'vite'

/**
 *
 * @param options 别名
 *
 * 使用别名
 */
export const useAliasOptions = (
  options?: { find: string; replacement: string }[],
) => {
  const alias = [
    {
      find: '@',
      replacement: path.resolve(__dirname, '../src'),
    },
    {
      find: '@use-utils',
      replacement: path.resolve(__dirname, '../src/utils'),
    },
    {
      find: '@use-api',
      replacement: path.resolve(__dirname, '../src/axios/api'),
    },
    {
      find: '@use-images',
      replacement: path.resolve(__dirname, '../src/assets/images'),
    },
  ]

  options?.forEach((curr) =>
    alias.push({
      find: curr.find,
      replacement: path.resolve(__dirname, curr.replacement),
    }),
  )

  return alias
}

/**
 *
 * @param imp 自动导入依赖
 * @returns auto import plugin
 *
 * 自动导入
 */
export const useAutoImport = async (imp: (ImportsMap | PresetName)[] = []) =>
  AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    dts: true,
    imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n', ...imp],
  })

/**
 *
 * @param resolvers 按需加载依赖项
 * @param types 按需加载依赖类型
 *
 * 按需加载
 */
export const useViteComponents = async (
  resolvers: (ComponentResolver | ComponentResolver[])[] = [],
  types: TypeImport[] = [],
) =>
  ViteComponents({
    dts: true,
    resolvers: [...resolvers],
    types: [
      {
        from: 'vue-router',
        names: ['RouterLink', 'RouterView'],
      },
      ...types,
    ],
  })

/**
 *
 * @param options
 *
 * 压缩打包
 */
export const useViteCompression = (options?: VitePluginCompression) =>
  viteCompression(Object.assign(options ?? {}))

export const useVueI18nPlugin = () =>
  VueI18nPlugin({
    runtimeOnly: true,
    compositionOnly: true,
    forceStringify: true,
    defaultSFCLang: 'json',
    include: [path.resolve(__dirname, '../locales/**')],
  })

/**
 *
 * @param title 浏览器 title 名称
 */
export const useHTMLTitlePlugin = (title = 'ray template') => {
  return {
    name: 'html-transform',
    transformIndexHtml: (html: string) => {
      return html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
    },
  }
}

/**
 *
 * @param options 自定义打包配置参数
 */
export const useViteBuildPlugin = (options?: BuildOptions) => {
  const defaultPlugin: BuildOptions = {
    outDir: 'dist', // 打包后文件输出路径
    assetsDir: 'assets', // 指定静态资源存放路径
    assetsInlineLimit: 4096, // 小于这个数字(字节)的静态资产文件将被内联为(base64)
    cssCodeSplit: true, // 拆分css代码
    minify: 'esbuild', // 指定使用混淆器(terser|esbuild)
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // 打包后移除console
        drop_debugger: true, // 打包后移除debugger
      },
    },
  }

  return Object.assign(defaultPlugin, options)
}

/**
 *
 * @param options 自定义项目启动参数
 */
export const useViteServerPlugin = (options?: ServerOptions) => {
  const server: ServerOptions = {
    host: '0.0.0.0',
    port: 9527,
    open: false,
    https: false,
    strictPort: false,
    fs: {
      strict: false,
      allow: [],
    },
    proxy: {
      '/api': {
        target: 'url',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }

  return Object.assign(server, options)
}

export const useEnvBuildOutput = (mode: string) => {
  let buildOptions = {
    outDir: 'dist/test-dist',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // 打包后移除console
        drop_debugger: true, // 打包后移除debugger
      },
    },
  }

  switch (mode) {
    case 'test':
      buildOptions = {
        outDir: 'dist/test-dist',
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: false, // 打包后移除console
            drop_debugger: false, // 打包后移除debugger
          },
        },
      }
      break

    case 'development':
      buildOptions = {
        outDir: 'dist/development-dist',
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: false, // 打包后移除console
            drop_debugger: false, // 打包后移除debugger
          },
        },
      }
      break

    case 'production':
      buildOptions = {
        outDir: 'dist/production-dist',
        sourcemap: false,
        terserOptions: {
          compress: {
            drop_console: true, // 打包后移除console
            drop_debugger: true, // 打包后移除debugger
          },
        },
      }
      break
  }

  return {
    buildOptions,
  }
}
