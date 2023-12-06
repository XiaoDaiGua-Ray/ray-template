/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-07
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

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
import { isValueType } from '@/utils/basic'

import type { Options } from 'currency.js'
import type { AnyFC } from '@/types/modules/utils'

export type CurrencyArguments = string | number | currency

export type OriginalValueType = 'string' | 'number'

// currency.js 默认配置
const defaultOptions: Partial<Options> = {
  precision: 8,
  decimal: '.',
}
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
]

/**
 *
 * @param valueOptions 待计算参数列表
 * @param dividend 初始值
 * @param cb 回调方法
 *
 * @remark 计算基础方法, 仅限于该处使用
 */
const basic = (
  valueOptions: CurrencyArguments[],
  dividend: CurrencyArguments,
  cb: AnyFC,
) => {
  if (!valueOptions?.length) {
    return 0
  }

  if (valueOptions.length === 1) {
    return currency(valueOptions[0], defaultOptions)
  }

  const result = valueOptions.reduce((pre, curr, idx, arr) => {
    pre = cb?.(pre, curr, idx, arr)

    return pre
  }, dividend)

  return result
}

/**
 *
 * @param value 待判断值
 *
 * 检查一个对象是否为 currency.js 的对象
 * 当该对象含有 s, intValue, p, value... 属性时, 则认为该对象为 currency.js 的对象
 *
 * @example
 * isCurrency(1.23) => false
 * isCurrency('1.23') => false
 * isCurrency({ s: 1, intValue: 1, p: 1, value: 1 }) => false
 * isCurrency(currency(1)) => true
 */
export const isCurrency = (value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return false
  }

  if (isValueType<object>(value, 'Object')) {
    return currencyPrototypeKeys.every((key) => Reflect.has(value, key))
  }

  return false
}

/**
 *
 * 格式化一个数据值, 并且返回其原始值
 * 默认以 number 格式返回
 *
 * 如果需要格式化为其他格式(如: 货币单位、分组、分隔符等), 请使用 currency format 方法格式
 */
export const format = (
  value: CurrencyArguments,
  options?: Options,
  type: OriginalValueType = 'number',
) => {
  const assignOptions = Object.assign({}, defaultOptions, options)
  const v = currency(value, assignOptions)

  return type === 'number' ? v.value : v.toString()
}

/**
 *
 * 加法
 *
 * @example
 * format(add(0.1, 0.2)) => 0.3
 * format(add(0.2, 0.33)) => 0.53
 */
export const add = (...args: CurrencyArguments[]) => {
  if (args.length === 1) {
    return currency(args[0], defaultOptions).add(0)
  }

  return basic(args, 0, (pre, curr) => {
    return currency(pre, defaultOptions).add(curr)
  })
}

/**
 *
 * 减法
 *
 * @example
 * format(subtract(0.1, 0.12312)) => -0.02
 * format(subtract(0.2, 0.33)) => -0.13
 */
export const subtract = (...args: CurrencyArguments[]) => {
  if (args.length === 1) {
    return currency(args[0], defaultOptions).subtract(0)
  }

  if (args.length === 2) {
    const [one, two] = args

    return currency(one, defaultOptions).subtract(two)
  }

  const cloneDeepArgs = cloneDeep(args)
  const dividend = cloneDeepArgs.shift() as CurrencyArguments

  if (!cloneDeepArgs.length) {
    return dividend
  }

  return basic(cloneDeepArgs, dividend, (pre, curr) => {
    return currency(pre, defaultOptions).subtract(curr)
  })
}

/**
 *
 * 乘法
 *
 * @example
 * format(multiply(1, 0.2)) => 0.2
 * format(multiply(0.2, 0.33)) => 0.07
 */
export const multiply = (...args: CurrencyArguments[]) => {
  if (args.length === 1) {
    return currency(args[0], defaultOptions).multiply(1)
  }

  return basic(args, 1, (pre, curr) => {
    return currency(pre, defaultOptions).multiply(curr)
  })
}

/**
 *
 * 除法
 *
 * @example
 * format(divide(1, 0.2)) => 5
 * format(divide(0.2, 0.33)) => 0.61
 */
export const divide = (...args: CurrencyArguments[]) => {
  if (args.length === 1) {
    return currency(args[0], defaultOptions).divide(1)
  }

  if (args.length === 2) {
    const [one, two] = args

    return currency(one, defaultOptions).divide(two)
  }

  const cloneDeepArgs = cloneDeep(args)
  const dividend = cloneDeepArgs.shift() as CurrencyArguments

  return basic(cloneDeepArgs, dividend, (pre, curr) => {
    return currency(pre, defaultOptions).divide(curr)
  })
}

/**
 *
 * 平分(将一个数值平均分配到一个数组中)
 * 如果值为 undefined null 会自动转换为 0
 *
 * @example
 * distribute(0, 1) => [0]
 * distribute(0, 3) => [0, 0, 0]
 */
export const distribute = (value: CurrencyArguments, length: number) => {
  if (length <= 1) {
    return [value ? value : 0]
  } else {
    if (!value) {
      return new Array(length).fill(0)
    }
  }

  const result = currency(value, defaultOptions)
    .distribute(length)
    .map((curr) => {
      return format(curr)
    })

  return result
}
