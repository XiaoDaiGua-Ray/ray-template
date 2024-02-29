import pkg from '../package.json'

import type { DependenciesKey } from './type'

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

/**
 *
 * @param dependenciesKey 依赖包名称
 *
 * @returns 依赖包版本号
 *
 * @description
 * 获取 package.json 文件中的依赖包版本号，如果不存在则抛出异常。
 *
 * @example
 * const vueVersion = getDependenciesVersion('vue') // vue version
 * const unknownVersion = getDependenciesVersion('unknown package') // Error
 */
export const getDependenciesVersion = (dependenciesKey: DependenciesKey) => {
  const { dependencies } = pkg
  const result = dependencies[dependenciesKey]

  if (!result) {
    throw Error(
      `[getDependenciesVersion]: The ${dependenciesKey} does not exist in the package.json file!`,
    )
  }

  return result.replace(/^[^\w\s]+/, '')
}
