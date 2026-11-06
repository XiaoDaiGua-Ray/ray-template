import currency from 'currency.js'
import type { Options } from 'currency.js'

/** 金额运算接受的输入类型。 */
export type CurrencyArguments = string | number | currency

export type OriginalValueType = 'string' | 'number'

export interface CurrencyOptions extends Options {
  type?: OriginalValueType
}

/** 以八位小数缩放为 Number 整数；调用方需确保缩放后的金额仍在安全整数范围内。 */
const defaultOptions = { precision: 8, decimal: '.' }

/**
 *
 * @param value 待判断的值
 *
 * @returns 是否为当前 currency.js 构造器创建的实例。
 */
export const isCurrency = (value: unknown): value is currency =>
  value instanceof currency

/**
 *
 * @param value 金额
 * @param options currency.js 精度配置与返回类型
 *
 * @returns 默认返回数字；type 为 string 时返回保留精度的数字字符串。
 */
export const format = (value: CurrencyArguments, options?: CurrencyOptions) => {
  const result = currency(value, { ...defaultOptions, ...options })

  return options?.type === 'string' ? result.toString() : result.value
}

/**
 *
 * @param args 按顺序相加的金额
 *
 * @returns 八位小数精度的和；无参数时为零。
 */
export const add = (...args: CurrencyArguments[]): currency =>
  args.reduce<currency>(
    (total, value) => total.add(value),
    currency(0, defaultOptions),
  )

/**
 *
 * @param args 首项为被减数，其余为减数
 *
 * @returns 八位小数精度的差；无参数时为零。
 */
export const subtract = (...args: CurrencyArguments[]): currency => {
  const [first = 0, ...rest] = args

  return rest.reduce<currency>(
    (total, value) => total.subtract(value),
    currency(first, defaultOptions),
  )
}

/**
 *
 * @param args 按顺序相乘的金额
 *
 * @returns 八位小数精度的积；无参数时为零。
 */
export const multiply = (...args: CurrencyArguments[]) => {
  const [first = 0, ...rest] = args

  return rest.reduce<currency>(
    (total, value) => {
      const factor =
        typeof value === 'string'
          ? currency(value, defaultOptions).value
          : value

      return total.multiply(factor)
    },
    currency(first, defaultOptions),
  )
}

/**
 *
 * @param args 首项为被除数，其余为除数
 *
 * @returns 八位小数精度的商；无参数时为零。
 *
 * @throws 除数为零或结果非有限时抛出 RangeError。
 */
export const divide = (...args: CurrencyArguments[]) => {
  const [first = 0, ...rest] = args

  return rest.reduce<currency>(
    (total, value) => {
      const result = total.divide(value)

      if (!Number.isFinite(result.value))
        throw new RangeError('[divide]: Invalid divisor or result.')

      return result
    },
    currency(first, defaultOptions),
  )
}

/**
 *
 * @param value 要分配的金额
 * @param length 份数，0 或 1 均视为一份
 * @param options 精度与返回类型
 *
 * @returns 总和等于按配置舍入后的金额；余数优先分到前面的份额。
 *
 * @throws 份数不是非负整数时抛出 RangeError。
 */
export const distribute = (
  value: CurrencyArguments,
  length: number,
  options?: CurrencyOptions,
) => {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('[distribute]: Invalid length.')
  }

  return currency(value, { ...defaultOptions, ...options })
    .distribute(Math.max(1, length))
    .map((part) => (options?.type === 'string' ? part.toString() : part.value))
}
