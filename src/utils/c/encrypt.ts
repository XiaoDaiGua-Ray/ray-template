import { AES } from 'crypto-js'
import { CRYPTO_KEY } from './constant'

import type { WordArray } from './types'

/**
 *
 * @param data 待加密数据
 * @param key 加密 key
 *
 * @description
 * 使用 AES 加密数据。
 *
 * @example
 * const data = { name: 'John Doe' }
 * const key = CRYPTO_KEY
 *
 * const encrypted = encrypt(data, key) // 'U2FsdGVkX1+3Q'
 */
export const encrypt = (data: unknown, key?: string | WordArray) => {
  const encrypted = AES.encrypt(JSON.stringify(data), key || CRYPTO_KEY)

  return encrypted.toString()
}
