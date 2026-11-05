import type { InjectionKey, ShallowRef } from 'vue'

export const config = {
  wrapperKey: Symbol('table-pro-wrapper') as InjectionKey<
    Readonly<ShallowRef<HTMLElement | null>>
  >,
}
