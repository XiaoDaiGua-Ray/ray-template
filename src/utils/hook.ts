/**
 *
 * @returns 获取当前项目环境
 */
export const getDetermineEnv = () => {
  const env = import.meta.env

  return env
}

/**
 *
 * @param data 二进制流数据
 *
 * @returns formate binary to base64 of the image
 */
export const useImagebufferToBase64 = (
  data: ArrayBufferLike | ArrayLike<number>,
) => {
  const base64 =
    'data:image/png;base64,' +
    window.btoa(
      new Uint8Array(data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    )

  return base64
}

/**
 *
 * @param value 目标值
 * @param type 类型
 */
export const validteValueType = <T = unknown>(
  value: T,
  type: ValidteValueType,
) => {
  const valid = Object.prototype.toString.call(value)

  return valid.includes(type)
}

/**
 *
 * @param length `uuid` 长度
 * @param radix `uuid` 基数
 * @returns `uuid`
 */
export const uuid = (length = 16, radix?: number) => {
  const sad =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const arr: string[] = []
  let i = 0

  radix = radix || sad.length

  if (length) {
    for (i = 0; i < length; i++) {
      arr[i] = sad[0 | (Math.random() * radix)]
    }
  } else {
    let r

    arr[23] = '-'
    arr[18] = arr[23]
    arr[13] = arr[18]
    arr[8] = arr[13]
    arr[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!arr[i]) {
        r = 0 | (Math.random() * radix)

        arr[i] = sad[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return arr.join('')
}
