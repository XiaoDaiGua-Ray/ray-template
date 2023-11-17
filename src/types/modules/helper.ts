/* eslint-disable @typescript-eslint/no-explicit-any */
export type ConditionalKeys<Base, Condition> = NonNullable<
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
  }[keyof Base]
>

export type ConditionalPick<Base, Condition> = Pick<
  Base,
  ConditionalKeys<Base, Condition>
>

export type Recordable<T = any> = Record<string, T>

export type ValueOf<T extends object> = T[keyof T]

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U>
    ? Array<DeepMutable<U>>
    : T[P] extends object
    ? DeepMutable<T[P]>
    : T[P]
}
