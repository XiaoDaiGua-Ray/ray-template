import type { DirectiveModules, CustomDirectiveFC } from '@/directives/types'

export const combineDirective = <
  T extends Record<string, DirectiveModules>,
  K extends keyof T,
>(
  directiveModules: T,
) => {
  const directives = Object.keys(directiveModules).reduce(
    (pre, curr) => {
      const fc = directiveModules[curr]?.default

      if (typeof fc === 'function') {
        pre[curr as K] = fc

        return pre
      } else {
        throw new TypeError(`directiveModules: ${curr} is not function`)
      }
    },
    {} as Record<K, CustomDirectiveFC<unknown, unknown>>,
  )

  return directives
}
