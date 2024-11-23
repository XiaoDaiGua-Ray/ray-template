/**
 *
 * 文档地址: <https://currency.js.org/#subtract>
 *
 * Options 默认值
 *   - symbol default: `$`(货币符号)
 *   - separator default: `,`(数字分隔符, demo: 1234.56 => '1,234.56')
 *   - decimal default: `.`(十进制分隔符, demo: 1.23 => '1.23')
 *   - precision default: `2`(精度保留位数)
 *   - pattern default: `!#`(!: 货币符号代替, #: 货币金额代替)
 *   - negativePattern default: `!#`(!: 货币符号代替, #: 货币金额代替)
 *   - format default: `null`(默认格式化方法替代, 看文档)
 *   - fromCents default: `false`(尊重精度选项)
 *   - errorOnInvalid default: `false`(传入 null undefined 直接抛出错误)
 *   - increment default: `null`(四舍五入增量值)
 *   - useVedic default: `false`(分组格式化值, demo: currency(1234567.89, { useVedic: true }).format() => '12,34,567.89')
 */

import currency from 'currency.js'
import { cloneDeep } from 'lodash-es'
import { isValueType } from '@/utils'

import type { Options } from 'currency.js'

export type CurrencyArguments = string | number | currency

export type OriginalValueType = 'string' | 'number'

export interface CurrencyOptions extends Options {
  type?: OriginalValueType
}

// currency.js 默认配置
const defaultOptions: Partial<CurrencyOptions> = {
  precision: 8,
  decimal: '.',
} as const
// currency.js 原型属性集合
const currencyPrototypeKeys = [
  's',
  'intValue',
  'p',
  'value',
  'toJSON',
  'add',
  'cents',
  'distribute',
  'divide',
  'dollars',
  'format',
  'multiply',
  'subtract',
  'toString',
] as const

/**
 *
 * @param valueOptions 待计算参数列表
 * @param dividend 初始值
 * @param cb 回调方法
 *
 * @description
 * 计算基础方法, 仅限于该处使用。
 */
const basic = (
  valueOptions: CurrencyArguments[],
  dividend: CurrencyArguments,
  cb: (
    pre: currency,
    curr: CurrencyArguments,
    idx: number,
    arr: CurrencyArguments[],
  ) => currency,
): currency => {
  // 如果 valueOptions 为空，则返回 0
  if (!valueOptions?.length) {
    return currency(0, defaultOptions)
  }

  // 如果 valueOptions 长度为 1，则返回 valueOptions[0]
  if (valueOptions.length === 1) {
    return currency(valueOptions[0], defaultOptions)
  }

  // 初始值
  const initialValue = currency(dividend, defaultOptions)

  // 计算
  return valueOptions.reduce(cb, initialValue)
}

/**
 *
 * @param value 待判断值
 *
 * 检查一个对象是否为 currency.js 的对象
 * 当该对象含有 s, intValue, p, value... 属性时, 则认为该对象为 currency.js 的对象
 *
 * @example
 * isCurrency(1.23) // false
 * isCurrency('1.23') // false
 * isCurrency({ s: 1, intValue: 1, p: 1, value: 1 }) // false
 * isCurrency(currency(1)) // true
 */
export const isCurrency = (value: unknown): value is currency => {
  // 如果 value 不是对象类型，则返回 false
  if (!isValueType<object>(value, 'Object')) {
    return false
  }

  // 如果 value 对象的属性在 currencyPrototypeKeys 中，则返回 true
  return currencyPrototypeKeys.every((key) => key in value)
}

/**
 *
 * @description
 * 格式化一个数据值, 并且返回其原始值。
 *
 * 默认以 number 格式返回。
 *
 * 如果需要格式化为其他格式(如: 货币单位、分组、分隔符等), 请使用 currency format 方法格式。
 *
 * @example
 * format(0.1) // 0.1
 * format(0.1, { symbol: '¥' }) // ¥0.1
 */
export const format = (value: CurrencyArguments, options?: CurrencyOptions) => {
  // 合并默认配置和传入配置
  const assignOptions = { ...defaultOptions, ...options }
  // 将 value 转换为 currency 对象
  const v = currency(value, assignOptions)
  // 获取 type 配置，如果 type 不存在，则使用 'number'
  const { type = 'number' } = assignOptions

  // 如果 type 为 'number'，则返回 value 的值，否则返回 value 的字符串
  return type === 'number' ? v.value : v.toString()
}
/**
 *
 * @description
 * 加法。
 *
 * @example
 * format(add(0.1, 0.2)) // 0.3
 * format(add(0.2, 0.33)) // 0.53
 */
export const add = (...args: CurrencyArguments[]): currency => {
  // 如果 args 为空，则返回 0
  if (!args.length) {
    return currency(0, defaultOptions)
  }

  // 如果 args 长度为 1，则返回 args[0] 加上 0
  if (args.length === 1) {
    return currency(args[0], defaultOptions).add(0)
  }

  // 计算
  return basic(args, 0, (pre, curr) => pre.add(curr))
}

/**
 *
 * @description
 * 减法。
 *
 * @example
 * format(subtract(0.1, 0.12312)) // -0.02
 * format(subtract(0.2, 0.33)) // -0.13
 */
export const subtract = (...args: CurrencyArguments[]): currency => {
  // 如果 args 为空，则返回 0
  if (!args.length) {
    return currency(0, defaultOptions)
  }

  // 如果 args 长度为 1，则返回 args[0] 减去 0
  if (args.length === 1) {
    return currency(args[0], defaultOptions).subtract(0)
  }

  // 如果 args 长度为 2，则返回 args[0] 减去 args[1]
  if (args.length === 2) {
    const [one, two] = args

    return currency(one, defaultOptions).subtract(two)
  }

  const [first, ...rest] = args

  return basic(rest, first, (pre, curr) => pre.subtract(curr))
}

/**
 *
 * @description
 * 乘法。
 *
 * @example
 * format(multiply(1, 0.2)) // 0.2
 * format(multiply(0.2, 0.33)) // 0.07
 */
export const multiply = (...args: CurrencyArguments[]) => {
  // 如果 args 长度为 1，则返回 args[0] 乘以 1
  if (args.length === 1) {
    return currency(args[0], defaultOptions).multiply(1)
  }

  // 计算
  return basic(args, 1, (pre, curr) => {
    return currency(pre, defaultOptions).multiply(curr)
  })
}

/**
 *
 * @description
 * 除法。
 *
 * @example
 * format(divide(1, 0.2)) // 5
 * format(divide(0.2, 0.33)) // 0.61
 */
export const divide = (...args: CurrencyArguments[]) => {
  // 如果 args 为空，则返回 0
  if (args.length === 1) {
    return currency(args[0], defaultOptions).divide(1)
  }

  // 如果 args 长度为 2，则返回 args[0] 除以 args[1]
  if (args.length === 2) {
    const [one, two] = args

    return currency(one, defaultOptions).divide(two)
  }

  // 深度克隆 args
  const cloneDeepArgs = cloneDeep(args)
  // 获取 dividend
  const dividend = cloneDeepArgs.shift() as CurrencyArguments

  return basic(cloneDeepArgs, dividend, (pre, curr) => {
    return currency(pre, defaultOptions).divide(curr)
  })
}

/**
 *
 * @description
 * 平分(将一个数值平均分配到一个数组中)，
 * 如果值为 undefined null 会自动转换为 0
 *
 * @example
 * distribute(0, 1) // [0]
 * distribute(2, 3) // [0.67, 0.67, 0.67]
 * distribute(3, 3) // [1, 1, 1]
 */
export const distribute = (
  value: CurrencyArguments,
  length: number,
  options?: CurrencyOptions,
) => {
  // 如果 length 小于等于 1，则返回一个包含 value 的数组
  if (length <= 1) {
    return [value ? value : 0]
  } else {
    // 如果 value 为 undefined null，则返回一个长度为 length 的 0 数组
    if (!value) {
      return new Array(length).fill(0)
    }
  }

  // 合并配置项
  const assignOptions = { ...defaultOptions, ...options }

  const result = currency(value, assignOptions)
    .distribute(length)
    .map((curr) => {
      return format(curr, assignOptions)
    })

  return result
}
