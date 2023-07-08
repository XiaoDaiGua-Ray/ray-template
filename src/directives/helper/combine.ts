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

import type { DirectiveModules, CustomDirectiveFC } from '@/directives/type'

export const combineDirective = <
  T extends Record<string, DirectiveModules>,
  K extends keyof T,
>(
  directiveModules: T,
) => {
  const directives = Object.keys(directiveModules).reduce((pre, curr) => {
    const fc = directiveModules[curr]?.default

    if (typeof fc === 'function') {
      pre[curr] = fc

      return pre
    } else {
      throw new Error('directiveModules[curr] is not function')
    }
  }, {} as Record<K, CustomDirectiveFC<unknown, unknown>>)

  return directives
}
