/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 *
 * @description
 * 从目标类型中挑选出符合条件的属性名。
 *
 * @example
 * ConditionalKeys<{ a: string, b: number }, string> // 'a'
 */
export type ConditionalKeys<Base, Condition> = NonNullable<
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
  }[keyof Base]
>

/**
 *
 * @description
 * 从目标类型中排除符合条件的属性。
 *
 * @example
 * ConditionalExclude<{ a: string, b: number }, string> // { b: number }
 */
export type ConditionalExclude<Base, Condition> = Omit<
  Base,
  ConditionalKeys<Base, Condition>
>

/**
 *
 * @description
 * 从目标类型中挑选出符合条件的属性。
 *
 * @example
 * ConditionalPick<{ a: string, b: number }, string> // { a: string }
 */
export type ConditionalPick<Base, Condition> = Pick<
  Base,
  ConditionalKeys<Base, Condition>
>

/**
 *
 * @description
 * 声明一个任意类型的对象。
 *
 * @example
 * const A: Recordable = { a: 1, b: [] }
 */
export type Recordable<T = any> = Record<string, T>

/**
 *
 * @description
 * 获取目标类型的所有属性类型。
 *
 * @example
 * ValueOf<{ a: string, b: number }> // string | number
 */
export type ValueOf<T extends object> = T[keyof T]

/**
 *
 * @description
 * 将目标所有属性变为可修改。
 *
 * @example
 * Mutable<{ readonly a: string }> // { a: string }
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 *
 * @description
 * 递归将目标所有属性变为可修改。
 *
 * @example
 * DeepMutable<{ readonly a: { readonly b: { readonly c: string } } }> // { a: { b: { c: string } } }
 */
export type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U>
    ? Array<DeepMutable<U>>
    : T[P] extends object
      ? DeepMutable<T[P]>
      : T[P]
}

/**
 *
 * @description
 * 获取 Promise 返回值类型。
 *
 * @example
 * ReturnPromiseType<Promise<string>> // string
 * ReturnPromiseType<Promise<string> | Promise<number>> // string | number
 */
export type ReturnPromiseType<T extends Promise<any>> =
  T extends Promise<infer U> ? U : never

/**
 *
 * @description
 * 深度只读。
 *
 * @example
 * DeepReadonly<{ a: { b: string } }> // { readonly a: { readonly b: string } }
 */
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>
    }
  : T
