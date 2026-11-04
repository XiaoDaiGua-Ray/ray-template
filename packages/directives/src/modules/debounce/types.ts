import type { AnyFn } from '@ray-template/utils/types'
import type { DebounceSettings } from 'lodash-es'

export interface DebounceBindingOptions {
  func: AnyFn
  trigger?: string
  wait?: number
  options?: DebounceSettings
}
