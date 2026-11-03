import type { InjectionKey, ShallowRef } from 'vue'

export const config = {
  tableIconSize: '18',
  wrapperKey: Symbol('table-pro-wrapper') as InjectionKey<
    Readonly<ShallowRef<HTMLElement | null>>
  >,
}
