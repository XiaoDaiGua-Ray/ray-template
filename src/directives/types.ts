import type { Recordable } from '@/types'
import type { App, Directive } from 'vue'

export type { DebounceBindingOptions } from './modules/debounce/types'
export type { ThrottleBindingOptions } from './modules/throttle/types'

export type CustomDirectiveFC<T, K> = () => Directive<T, K>

export interface DirectiveModules<T = unknown, K = unknown> extends Recordable {
  default: CustomDirectiveFC<T, K>
}

export type AppType = App<Element>
