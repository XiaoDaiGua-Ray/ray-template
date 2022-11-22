export interface IconEventMapOptions {
  [propName: string]: (...args: unknown[]) => unknown
}

export type IconEventMap = keyof IconEventMapOptions
