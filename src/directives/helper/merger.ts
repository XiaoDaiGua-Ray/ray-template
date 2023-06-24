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

import type { Directive } from 'vue'
import type { DirectiveModules } from '@/directives/type'

export const mergerDirective = (
  directiveModules: Record<string, DirectiveModules>,
) => {
  const directives = Object.keys(directiveModules).reduce((pre, curr) => {
    const value = directiveModules[curr].default

    pre[curr] = value

    return pre
  }, {} as Record<string, Directive>)

  return directives
}
