import { defineResolve } from 'vite-plugin-cdn2/resolve'

/**
 *
 * @param title 浏览器 title 名称
 */
export const htmlTitlePlugin = (title: string) => {
  return {
    name: 'html-transform',
    transformIndexHtml: (html: string) => {
      return html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
    },
  }
}

/**
 *
 * @param options 预处理 css 文件
 * @returns additionalData string
 *
 * @description
 * 辅助处理需要全局注入的 css 样式文件，会在构建期间完成注入。
 */
export const mixinCSSPlugin = (options?: string[]) => {
  if (!Array.isArray(options)) {
    throw TypeError(
      'mixinCSSPlugin: The mixinCSSPlugin argument must be an array!',
    )
  }

  const mixinString = options.reduce((pre, curr) => {
    const temp = `@import "${curr}";`

    return (pre += temp)
  }, '')

  return mixinString as string
}

export const cdnResolve = defineResolve({
  name: 'RayTemplateCdnResolve',
  setup({ extra }) {
    const baseURL = 'https://cdnjs.cloudflare.com/ajax/libs/'
    const { version, name, relativeModule } = extra
    const url = new URL(`${name}/${version}/${relativeModule}`, baseURL)

    return {
      url: url.href,
      injectTo: 'head-prepend',
      attrs: {},
    }
  },
})
