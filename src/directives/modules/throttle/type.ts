import type { ThrottleSettings } from 'lodash-es'
import type { AnyFC } from '@/types/modules/utils'

export interface ThrottleBindingOptions {
  func: AnyFC
  trigger: string
  wait: number
  options: ThrottleSettings
}
