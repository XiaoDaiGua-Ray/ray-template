import path from 'node:path'

import viteCompression from 'vite-plugin-compression' // 压缩打包
import AutoImport from 'unplugin-auto-import/vite' // 自动导入
import ViteComponents from 'unplugin-vue-components/vite' // 自动按需导入
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // svg图标
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
    imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', ...imp],
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

/**
 *
 * 使用 svg 图标
 */
export const useCreateSvgIconsPlugin = () =>
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/icons')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',

    /**
     * 自定义插入位置
     * @default: body-last
     */
    // inject?: 'body-last' | 'body-first'

    /**
     * custom dom id
     * @default: __svg__icons__dom__
     */
    // customDomId: '__svg__icons__dom__',
  })

export const useVueI18nPlugin = () =>
  VueI18nPlugin({
    runtimeOnly: true,
    compositionOnly: true,
    include: [path.resolve(__dirname, '../src/language/**')],
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
    assetsInlineLimit: 4096,
    cssCodeSplit: true, // 拆分css代码
    minify: 'esbuild', // 指定使用混淆器(terser|esbuild)
    sourcemap: false,
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
