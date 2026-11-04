import type { InjectionKey } from 'vue'

export const exampleFocusKey: InjectionKey<{
  path: string
  names: ReadonlySet<string>
}> = Symbol('exampleFocus')
