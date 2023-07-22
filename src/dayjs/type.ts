import type { AppCurrentAppMessages } from '@/locales/type'

type A<T> = {
  [K in keyof T & string]: T[K] extends object ? string : never
}

type PickDayjsLocalValue<T> = {
  [K in keyof T]: T[K]
}[keyof T]

type DayjsLocalMaps = A<AppCurrentAppMessages>

export type DayjsLocal = PickDayjsLocalValue<DayjsLocalMaps>

export type DayjsLocalMap = Record<keyof AppCurrentAppMessages, DayjsLocal>
