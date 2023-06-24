import type { DebounceSettings } from 'lodash-es'

export interface DebounceBindingOptions {
  func: AnyFunc
  trigger: string
  wait: number
  options: DebounceSettings
}
