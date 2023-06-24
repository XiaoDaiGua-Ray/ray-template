import type { ThrottleSettings } from 'lodash-es'

export interface ThrottleBindingOptions {
  func: AnyFunc
  trigger: string
  wait: number
  options: ThrottleSettings
}
