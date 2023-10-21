import type { ComponentPublicInstance } from 'vue'

export type TargetValue<T> = T | undefined | null

export type TargetType =
  | HTMLElement
  | Element
  | SVGElement
  | Window
  | Document
  | ComponentPublicInstance

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | Ref<TargetValue<T>>
