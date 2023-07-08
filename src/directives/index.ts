/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { combineDirective } from './helper/combine'
import { forIn } from 'lodash-es'
import { isValueType } from '@/utils/hook'

import type { App } from 'vue'
import type { DirectiveModules } from '@/directives/type'

/**
 *
 * 初始化全局自定义指令
 *
 * 该方法会将 modules 下每个文件夹视为一个指令
 * 并且会将文件夹名称识别为指令名称
 * 每个文件下的 index.ts 文件视为每个指令的入口(也就是指令的处理逻辑, 需要暴露出一个 Directive 类型的对象)
 */
export const setupDirectives = (app: App<Element>) => {
  // 获取 modules 包下所有的 index.ts 文件
  const directiveRawModules: Record<string, DirectiveModules> =
    import.meta.glob('./modules/**/index.ts', {
      eager: true,
    })
  // 将所有的包提取出来(./modules/[file-name]/index.ts)
  const directivesModules = combineDirective(directiveRawModules)
  // 提取文件名(./modules/copy/index.ts => copy)
  const reg = /(?<=modules\/).*(?=\/index\.ts)/

  forIn(directivesModules, (value, key) => {
    const dname = key.match(reg)?.[0]

    if (isValueType<string>(dname, 'String')) {
      app.directive(dname, value?.())
    } else {
      throw new Error(
        'directiveName is not string, please check your directive file name',
      )
    }
  })
}
