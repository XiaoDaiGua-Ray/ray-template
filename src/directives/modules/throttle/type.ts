import type { ThrottleSettings } from 'lodash-es'
import type { AnyFunc } from '@/types/modules/utils'

export interface ThrottleBindingOptions {
  func: AnyFunc
  trigger: string
  wait: number
  options: ThrottleSettings
}
