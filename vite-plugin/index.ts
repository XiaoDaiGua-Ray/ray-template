import path from 'node:path'

import viteCompression from 'vite-plugin-compression' // 压缩打包
import autoImport from 'unplugin-auto-import/vite' // 自动导入
import viteComponents from 'unplugin-vue-components/vite' // 自动按需导入
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite' // i18n
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // `svg icon`

import type { ComponentResolver, TypeImport } from 'unplugin-vue-components'
import type { VitePluginCompression } from './type'
import type { ImportsMap, PresetName } from 'unplugin-auto-import/types'
import type { ServerOptions, BuildOptions } from 'vite'
import type { ViteSvgIconsPlugin } from 'vite-plugin-svg-icons'

/**
 *
 * @param options `svg icon` 自定义配置
 *
 * 使用 `svg` 作为图标
 */
export const useSVGIcon = (options?: ViteSvgIconsPlugin) => {
  const defaultOptions = {
    iconDirs: [path.resolve(process.cwd(), 'src/icons')],
    symbolId: 'icon-[dir]-[name]',
    inject: 'body-last',
    customDomId: '__svg__icons__dom__',
  }

  return createSvgIconsPlugin(Object.assign(defaultOptions, options))
}

/**
 *
 * @param imp 自动导入依赖
 * @returns auto import plugin
 *
 * 自动导入
 */
export const useAutoImport = async (imp: (ImportsMap | PresetName)[] = []) =>
  autoImport({
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
  viteComponents({
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
  vueI18nPlugin({
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
export const HTMLTitlePlugin = (title = 'ray template') => {
  return {
    name: 'html-transform',
    transformIndexHtml: (html: string) => {
      return html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
    },
  }
}

/**
 *
 * @param mode 打包环境
 *
 * @remark 打包输出文件配置
 */
export const buildOptions = (mode: string): BuildOptions => {
  switch (mode) {
    case 'test':
      return {
        outDir: 'dist/test-dist',
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: false,
            drop_debugger: false,
          },
        },
      }

    case 'development':
      return {
        outDir: 'dist/development-dist',
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: false,
            drop_debugger: false,
          },
        },
      }

    case 'production':
      return {
        outDir: 'dist/production-dist',
        sourcemap: false,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }

    case 'report':
      return {
        outDir: 'dist/report-dist',
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: false,
            drop_debugger: false,
          },
        },
      }

    default:
      return {
        outDir: 'dist/test-dist',
        sourcemap: false,
        terserOptions: {
          compress: {
            drop_console: true, // 打包后移除 `console`
            drop_debugger: true, // 打包后移除 `debugger`
          },
        },
      }
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
