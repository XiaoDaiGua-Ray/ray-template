import type { Directive } from 'vue'
import type { App } from 'vue'

export type { DebounceBindingOptions } from './modules/debounce/type'
export type { ThrottleBindingOptions } from './modules/throttle/type'

export type CustomDirectiveFC<T, K> = () => Directive<T, K>

export interface DirectiveModules extends Object {
  default: CustomDirectiveFC<unknown, unknown>
}

export type AppType = App<Element>
