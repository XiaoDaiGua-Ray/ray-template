/* eslint-disable @typescript-eslint/no-explicit-any */
import type CryptoJS from 'crypto-js'
import type { BasicTarget } from './vue'

export type StorageLike = 'sessionStorage' | 'localStorage'

export type RemoveStorageKey =
  | string
  | 'all'
  | 'all-sessionStorage'
  | 'all-localStorage'

export type EventListenerOrEventListenerObject =
  | EventListener
  | EventListenerObject

export type ValidteValueType =
  | 'Object'
  | 'Undefined'
  | 'Null'
  | 'Boolean'
  | 'Number'
  | 'String'
  | 'Symbol'
  | 'Function'
  | 'Date'
  | 'Array'
  | 'RegExp'
  | 'Map'
  | 'Set'
  | 'WeakMap'
  | 'WeakSet'
  | 'ArrayBuffer'
  | 'DataView'
  | 'Int8Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Int16Array'
  | 'Uint16Array'
  | 'Int32Array'
  | 'Uint32Array'
  | 'Float32Array'
  | 'Float64Array'

export type WordArray = CryptoJS.lib.WordArray

export type CipherParams = CryptoJS.lib.CipherParams

export type AnyFC<P = any, R = any> = (...args: P[]) => R

export type PartialCSSStyleDeclaration = Partial<
  Record<keyof CSSStyleDeclaration, string>
>

export type ElementSelector = string | `attr:${string}`

export type MaybeArray<T> = T | T[]

export type DownloadAnyFileDataType = Blob | File | string | ArrayBuffer

export type EventListenerTarget = BasicTarget<
  HTMLElement | Element | Window | Document
>
