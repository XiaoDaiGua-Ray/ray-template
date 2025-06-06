type ValueType = number | [number, number] | null

export function getDateByNaiveDatePicker<
  T extends ValueType = ValueType,
  V extends boolean = boolean,
>(
  value: T,
  isRange: V,
): V extends true ? (T extends null ? [null, null] : T) : T

/**
 *
 * @param value date value
 * @param isRange date picker type props is range type
 *
 * @description
 * 辅助获取 naive date picker 组件获取 value 的方法。
 *
 * 如果使用 BDatePicker 组件启用的 type 模式为 range，则需要设置第二个参数为 true，否则设置为 false。
 *
 * @example
 * // s1: null, e1: null
 * const [s1, e1] = getDateByNaiveDatePicker(null, true)
 * // s2: null
 * const s2 = getDateByNaiveDatePicker(null, false)
 * // s3: new Date().getTime()
 * const s3 = getDateByNaiveDatePicker(new Date().getTime(), false)
 * // s4: new Date().getTime(), e4: new Date().getTime()
 * const [s4, e4] = getDateByNaiveDatePicker(
 *   [new Date().getTime(), new Date().getTime()],
 *   true,
 * )
 */
export function getDateByNaiveDatePicker(value: ValueType, isRange: boolean) {
  if (value === null) {
    return isRange ? [null, null] : null
  }

  return value
}
