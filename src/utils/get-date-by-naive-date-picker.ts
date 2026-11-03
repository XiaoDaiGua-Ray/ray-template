type ValueType = number | [number, number] | null

/**
 *
 * @param value Naive UI 日期选择器的值
 * @param isRange 是否使用范围模式
 *
 * @returns 清空的范围返回 [null, null]，其余保留原值。
 */
export function getDateByNaiveDatePicker<
  T extends ValueType = ValueType,
  V extends boolean = boolean,
>(
  value: T,
  isRange: V,
): V extends true ? (T extends null ? [null, null] : T) : T

export function getDateByNaiveDatePicker(value: ValueType, isRange: boolean) {
  if (value === null) {
    return isRange ? [null, null] : null
  }

  return value
}
