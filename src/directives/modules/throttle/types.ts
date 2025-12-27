import type { AnyFn } from '@/types'
import type { ThrottleSettings } from 'lodash-es'

export interface ThrottleBindingOptions {
  func: AnyFn
  trigger?: string
  wait?: number
  options?: ThrottleSettings
}
