/**
 *
 * @returns 获取当前项目环境
 */
export const useDetermineEnv = () => {
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
  const _base64 =
    'data:image/png;base64,' +
    window.btoa(
      new Uint8Array(data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    )

  return _base64
}

/**
 *
 * @param value 目标值
 * @param type 类型
 */
export const useValidteValueType = <T>(value: T, type: ValidteValueType) => {
  const _v = Object.prototype.toString.call(value)

  return _v.includes(type)
}
