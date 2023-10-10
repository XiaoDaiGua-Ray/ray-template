import type { ComponentPublicInstance, MaybeRef } from 'vue'
import type { MaybeElement } from './element'

export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>

export type VueInstance = ComponentPublicInstance

export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T)

export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> =
  MaybeRefOrGetter<T>

export type UnRefElementReturn<T extends MaybeElement = MaybeElement> =
  T extends VueInstance ? Exclude<MaybeElement, VueInstance> : T | undefined
