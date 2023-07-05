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

import type { DirectiveModules } from '@/directives/type'

export const combineDirective = <
  T extends Record<string, DirectiveModules>,
  K extends keyof T,
>(
  directiveModules: T,
) => {
  const directives = Object.keys(directiveModules).reduce((pre, curr) => {
    if (directiveModules[curr]?.default) {
      const value = directiveModules[curr]?.default

      pre[curr] = value

      return pre
    } else {
      throw new Error('directiveModules[curr]?.default is undefined')
    }
  }, {} as Record<K, T[K]['default']>)

  return directives
}
