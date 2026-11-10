import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js/core'
import { CRYPTO_KEY } from './constant'
import type { CipherParams, WordArray } from './types'

/**
 *
 * @param data encrypt 返回的密文，或 CryptoJS CipherParams
 * @param key 与加密时相同的口令或原始密钥
 *
 * @returns 解密后的 JSON；密文无法解析时记录错误并返回 undefined。
 */
export const decrypt = (
  data: string | CipherParams,
  key?: string | WordArray,
) => {
  try {
    if (typeof key === 'object') {
      const parts =
        typeof data === 'string' ? /^([a-f0-9]{32}):(.+)$/i.exec(data) : null
      const iv =
        typeof data === 'string'
          ? parts && CryptoJS.enc.Hex.parse(parts[1])
          : data.iv

      if (!iv) throw new Error('Missing AES initialization vector.')

      const decrypted = AES.decrypt(parts?.[2] ?? data, key, { iv })

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    }

    const decrypted = AES.decrypt(data, key || CRYPTO_KEY)

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    console.error('[decrypt]: Invalid ciphertext or key.', error)
  }
}
