import { AES, enc } from 'crypto-js'
import { CRYPTO_KEY } from './constant'

import type { CipherParams, WordArray } from './types'

/**
 *
 * @param data AES 加密后的数据
 * @param key 解密 key
 *
 * @description
 * 使用 AES 解密数据。
 *
 * @example
 * const data = 'U2FsdGVkX1+3Q
 * const key = CRYPTO_KEY
 *
 * const decrypted = decrypt(data, key) // { name: 'John Doe' }
 */
export const decrypt = (
  data: string | CipherParams,
  key?: string | WordArray,
) => {
  try {
    const decrypted = AES.decrypt(data, key || CRYPTO_KEY)
    const decryptedData = decrypted.toString(enc.Utf8)

    return JSON.parse(decryptedData)
  } catch (e) {
    console.error(`Unknown error: ${e}`)
  }
}
