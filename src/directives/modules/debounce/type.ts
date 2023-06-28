import type { DebounceSettings } from 'lodash-es'
import type { AnyFunc } from '@/types/modules/utils'

export interface DebounceBindingOptions {
  func: AnyFunc
  trigger: string
  wait: number
  options: DebounceSettings
}
