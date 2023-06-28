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
