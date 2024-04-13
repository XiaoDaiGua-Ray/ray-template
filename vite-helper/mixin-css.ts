/**
 *
 * @param options 预处理 css 文件
 *
 * @description
 * 辅助处理需要全局注入的 css 样式文件，会在构建期间完成注入。
 *
 * 路径会以传递的具体进行解析。
 */
export const mixinCss = (options?: string[]) => {
  if (!Array.isArray(options)) {
    throw TypeError('[mixinCss]: The mixinCSSPlugin argument must be an array!')
  }

  const mixinString = options.reduce((pre, curr) => {
    const temp = `@import "${curr}";`

    return (pre += temp)
  }, '')

  return mixinString as string
}
