import { forIn } from 'lodash-es'
import type { App, Directive } from 'vue'
import type { DirectiveModules } from './types'
import { combineDirective } from './utils/combine'

/**
 *
 * 初始化全局自定义指令
 *
 * 该方法会将 modules 下每个文件夹视为一个指令
 * 并且会将文件夹名称识别为指令名称
 * 每个文件下的 index.ts 文件视为每个指令的入口(也就是指令的处理逻辑, 需要暴露出一个 Directive 类型的对象)
 */
export const setupDirectives = (
  app: App<Element>,
  overrides: Record<string, Directive> = {},
) => {
  // 获取 modules 包下所有的 index.ts 文件
  const directiveRawModules: Record<string, DirectiveModules> =
    import.meta.glob('./modules/**/index.ts', {
      eager: true,
    })
  // 将所有的包提取出来(./modules/[file-name]/index.ts)
  const directivesModules = combineDirective(directiveRawModules)
  // 提取文件名(./modules/copy/index.ts => copy)
  const regexExtractDirectiveName = /(?<=modules\/).*(?=\/index\.ts)/
  // 匹配合法指令名称
  const regexDirectiveName = /^([^-]+-)*[^-]+$/

  forIn(directivesModules, (value, key) => {
    const directiveBindName = key.match(regexExtractDirectiveName)?.[0]

    if (
      typeof directiveBindName === 'string' &&
      regexDirectiveName.test(directiveBindName)
    ) {
      app.directive(directiveBindName, overrides[directiveBindName] ?? value())
    } else {
      console.error(
        `[setupDirectives] ${directiveBindName} is not a valid directive name`,
      )
    }
  })
}

export { default as copy } from './modules/copy'
export { default as debounce } from './modules/debounce'
export { default as disabled } from './modules/disabled'
export { default as ellipsis } from './modules/ellipsis'
export { default as ripple } from './modules/ripple'
export { default as throttle } from './modules/throttle'
