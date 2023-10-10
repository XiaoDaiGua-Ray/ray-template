import type { VueInstance } from './vue'

export type MaybeElement =
  | HTMLElement
  | SVGElement
  | VueInstance
  | undefined
  | null
