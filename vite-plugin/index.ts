import path from 'node:path'

import unpluginViteComponents from 'unplugin-vue-components/vite' // 自动按需导入
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
export const viteSVGIcon = (options?: ViteSvgIconsPlugin) => {
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
 * @param resolvers 按需加载依赖项
 * @param types 按需加载依赖类型
 *
 * 按需加载
 */
export const viteComponents = async (
  resolvers: (ComponentResolver | ComponentResolver[])[] = [],
  types: TypeImport[] = [],
) =>
  unpluginViteComponents({
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

export const viteVueI18nPlugin = () =>
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
 * @param options 预处理 css 文件
 * @returns additionalData string
 *
 * @remark 辅助处理需要全局注入的 css 样式文件, 会在构建期间完成注入
 */
export const mixinCSSPlugin = (options?: string[]) => {
  const defaultOptions = []

  if (Array.isArray(options)) {
    defaultOptions.push(...options)
  }

  const mixisString = defaultOptions.reduce((pre, curr) => {
    const temp = `@import "${curr}";`

    return (pre += temp)
  }, '')

  return mixisString as string
}
