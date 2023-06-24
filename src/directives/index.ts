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

import { mergerDirective } from './helper/merger'
import { forIn } from 'lodash-es'

import type { App } from 'vue'
import type { DirectiveModules } from '@/directives/type'

/** 初始化全局自定义指令 */
export const setupDirective = (app: App<Element>) => {
  const modules = import.meta.glob('./modules/**/index.ts', {
    eager: true,
  }) as Record<string, DirectiveModules>
  const directives = mergerDirective(modules)
  const reg = /(?<=modules\/).*(?=\/index\.ts)/

  forIn(directives, (value, key) => {
    const directiveName = key.match(reg)?.[0] as string

    app.directive(directiveName, value)
  })
}
