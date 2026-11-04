/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValidateValueType =
  | 'BigUint64Array'
  | 'BigInt64Array'
  | 'Float64Array'
  | 'Float32Array'
  | 'Uint32Array'
  | 'Int32Array'
  | 'Uint16Array'
  | 'Int16Array'
  | 'Uint8ClampedArray'
  | 'Uint8Array'
  | 'Int8Array'
  | 'DataView'
  | 'ArrayBuffer'
  | 'WeakSet'
  | 'WeakMap'
  | 'Set'
  | 'Map'
  | 'Error'
  | 'Date'
  | 'RegExp'
  | 'Object'
  | 'Array'
  | 'Function'
  | 'BigInt'
  | 'Symbol'
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'Null'
  | 'Undefined'

export type BasicTypes =
  | undefined
  | null
  | boolean
  | number
  | string
  | symbol
  | bigint
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | any[]
  | object
  | RegExp
  | Date
  | Error
  | Map<any, any>
  | Set<any>
  | WeakMap<object, any>
  | WeakSet<object>
  | ArrayBuffer
  | DataView
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

export type AnyFn<P = any, R = any> = (...args: P[]) => R

export type VoidFC = (...args: any[]) => void

export type ElementSelector = string | `attr:${string}`

export type MaybeArray<T> = T | T[]

export type DownloadAnyFileDataType = Blob | File | string | ArrayBuffer

export enum OperatingSystem {
  Windows = 'Windows',
  MacOS = 'MacOS',
  Linux = 'Linux',
  Android = 'Android',
  IOS = 'IOS',
  Unknown = 'Unknown',
}

export interface QueryElementsOptions<T extends Element = Element> {
  defaultElement?: T
}

export type PropertyName = string | number | symbol

export type Many<T> = T | ReadonlyArray<T>

export type Recordable<T = any> = Record<string | number | symbol, T>
export type SetRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>
