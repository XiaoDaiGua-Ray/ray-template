import path from 'node:path'

import autoImport from 'unplugin-auto-import/vite' // 自动导入
import viteComponents from 'unplugin-vue-components/vite' // 自动按需导入
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite' // i18n
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons' // `svg icon`

import type { ComponentResolver, TypeImport } from 'unplugin-vue-components'
import type { ImportsMap, PresetName } from 'unplugin-auto-import/types'
import type { BuildOptions } from 'vite'
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

  return createSvgIconsPlugin(Object.assign({}, defaultOptions, options))
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
export const HTMLTitlePlugin = (title: string) => {
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
  const outDirMap = {
    test: 'dist/test-dist',
    development: 'dist/development-dist',
    production: 'dist/production-dist',
    report: 'dist/report-dist',
  }
  const dirPath = outDirMap[mode] || 'dist/test-dist'

  if (mode === 'production') {
    return {
      outDir: dirPath,
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    }
  } else {
    return {
      outDir: dirPath,
      sourcemap: true,
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false,
        },
      },
    }
  }
}

/**
 *
 * @param options 自定义打包配置参数
 *
 * @remark 移除 console debugger 会有严重的副作用, 如果 console 语句中含有变量输出, 则会阻止移除
 * @remark console 可能会导致内存泄漏, 请注意使用
 */
export const useViteBuildPlugin = (options?: BuildOptions) => {
  const defaultPlugin: BuildOptions = {
    outDir: 'dist', // 打包后文件输出路径
    assetsDir: 'assets', // 指定静态资源存放路径
    assetsInlineLimit: 4096, // 小于这个数字(字节)的静态资产文件将被内联为(base64)
    cssCodeSplit: true, // 拆分css代码
    minify: 'esbuild', // 指定使用混淆器 (terser | esbuild)
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // 打包后移除console
        drop_debugger: true, // 打包后移除debugger
      },
    },
  }

  return Object.assign({}, defaultPlugin, options)
}
