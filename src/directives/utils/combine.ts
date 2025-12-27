import type { CustomDirectiveFC, DirectiveModules } from '@/directives/types'

export const combineDirective = <
  T extends Record<string, DirectiveModules>,
  K extends keyof T,
>(
  directiveModules: T,
) => {
  const directives = Object.keys(directiveModules).reduce(
    (pre, curr) => {
      const fn = directiveModules[curr]?.default

      if (typeof fn === 'function') {
        pre[curr as K] = fn

        return pre
      } else {
        throw new TypeError(`directiveModules: ${curr} is not function`)
      }
    },
    {} as Record<K, CustomDirectiveFC<unknown, unknown>>,
  )

  return directives
}
