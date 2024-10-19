/* eslint-disable @typescript-eslint/no-explicit-any */

export function array(length: number) {
  return new Array(length).fill(0)
}

/**
 *
 * @param pageCurrent 当前页码
 * @param pageSize 分页展示条数
 * @param array 数据
 *
 * mock 分页展示数据
 */
export function pagination<T = any>(
  pageCurrent: number,
  pageSize: number,
  array: T[],
): T[] {
  const offset = (pageCurrent - 1) * Number(pageSize)

  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize))
}

/**
 *
 * @param value 原始数据
 *
 * 格式化数据为 json 格式
 */
export function stringify<T = unknown>(value: T) {
  return JSON.stringify(value)
}

/**
 *
 * @param res 数据
 * @param code 响应码
 * @param msg 响应信息
 */
export function response<T = any>(
  res: T,
  code: number,
  msg: string,
  params?: object,
) {
  const basic = {
    code,
    msg,
    data: res,
    ...params,
  }

  return basic
}
