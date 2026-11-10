import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js/core'
import { CRYPTO_KEY } from './constant'
import type { WordArray } from './types'

/**
 *
 * @param data 可序列化为 JSON 的数据
 * @param key AES 口令或原始密钥，默认使用模板历史口令
 *
 * @description
 * 字符串口令沿用历史 OpenSSL 格式；原始密钥使用独立的随机 IV，并将 IV 与密文一并返回。
 *
 * @returns 可传给 decrypt 的序列化密文。
 *
 * @throws 数据不可序列化或 AES 加密失败时抛错。
 */
export const encrypt = (data: unknown, key?: string | WordArray) => {
  const json = JSON.stringify(data)

  if (json === void 0)
    throw new TypeError('[encrypt]: Value is not JSON serializable.')

  if (typeof key === 'object') {
    const iv = CryptoJS.lib.WordArray.random(16)
    const ciphertext = AES.encrypt(json, key, { iv })

    return `${iv.toString()}:${ciphertext.toString()}`
  }

  return AES.encrypt(json, key || CRYPTO_KEY).toString()
}
