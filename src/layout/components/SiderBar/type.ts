import type { DropdownOption } from 'naive-ui'

export interface IconEventMapOptions {
  [propName: string]: (...args: unknown[]) => unknown
}

export type IconEventMap = keyof IconEventMapOptions

export interface IconDropdownOptions extends UnknownObjectKey {
  event?: string
  switch: boolean
  options: DropdownOption[]
  eventKey?: string
}

export interface IconOptions {
  name: string
  size?: number
  tooltip?: string
  eventKey?: string
  dropdown?: IconDropdownOptions
}
