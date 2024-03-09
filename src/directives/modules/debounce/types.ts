import type { DebounceSettings } from 'lodash-es'
import type { AnyFC } from '@/types'

export interface DebounceBindingOptions {
  func: AnyFC
  trigger?: string
  wait?: number
  options?: DebounceSettings
}
