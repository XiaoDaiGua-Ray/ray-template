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
 *   - fromCents default: `false`
 *   - fromCents default: `false`(尊重精度选项)
 *   - errorOnInvalid default: `false`(传入 null undefined 直接抛出错误)
 *   - increment default: `null`(四舍五入增量值)
 *   - useVedic default: `false`(分组格式化值, demo: currency(1234567.89, { useVedic: true }).format() => '12,34,567.89')
 */

import currency from 'currency.js'
import { cloneDeep } from 'lodash-es'

import type { Options } from 'currency.js'

export type CurrencyArguments = string | number | currency

export type OriginalValueType = 'string' | 'number'

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
  cb: AnyFunc,
) => {
  if (!valueOptions?.length) {
    return 0
  }

  if (valueOptions.length === 1) {
    return currency(valueOptions[0])
  }

  const result = valueOptions.reduce((pre, curr, idx, arr) => {
    pre = cb?.(pre, curr, idx, arr)

    return pre
  }, dividend)

  return result
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
  return type === 'number'
    ? currency(value, options).value
    : currency(value, options).toString()
}

/** 加法 */
export const add = (...args: CurrencyArguments[]) => {
  return basic(args, 0, (pre, curr) => {
    return currency(pre).add(curr)
  })
}

/** 减法 */
export const subtract = (...args: CurrencyArguments[]) => {
  if (args.length === 2) {
    const [one, two] = args

    return currency(one).subtract(two)
  }

  const cloneDeepArgs = cloneDeep(args)
  const dividend = cloneDeepArgs.shift() as CurrencyArguments

  if (!cloneDeepArgs.length) {
    return dividend
  }

  return basic(cloneDeepArgs, dividend, (pre, curr) => {
    return currency(pre).subtract(curr)
  })
}

/** 乘法 */
export const multiply = (...args: CurrencyArguments[]) => {
  return basic(args, 1, (pre, curr) => {
    return currency(pre).multiply(curr)
  })
}

/** 除法 */
export const divide = (...args: CurrencyArguments[]) => {
  if (args.length === 2) {
    const [one, two] = args

    return currency(one).divide(two)
  }

  const cloneDeepArgs = cloneDeep(args)
  const dividend = cloneDeepArgs.shift() as CurrencyArguments

  if (!cloneDeepArgs.length) {
    return dividend
  }

  return basic(cloneDeepArgs, dividend, (pre, curr) => {
    return currency(pre).divide(curr)
  })
}

/**
 *
 * 平分(将一个数值平均分配到一个数组中)
 * 如果值为 undefind null 会自动转换为 0
 *
 * ```
 * distribute(0, 1) => [0]
 * distribute(0, 3) => [0, 0, 0]
 * ```
 */
export const distribute = (
  value: CurrencyArguments,
  length: number,
  options?: Options,
) => {
  if (length <= 1) {
    return [value ? value : 0]
  } else {
    if (!value) {
      return new Array(length).fill(0)
    }
  }

  const result = currency(value, options)
    .distribute(length)
    .map((curr) => {
      return format(curr, options)
    })

  return result
}
