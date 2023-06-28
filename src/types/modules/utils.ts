/* eslint-disable @typescript-eslint/no-explicit-any */
import type CryptoJS from 'crypto-js'

export type CacheType = 'sessionStorage' | 'localStorage'

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

export type AnyFunc = (...args: any[]) => any

export type AnyVoidFunc = (...args: any[]) => void
