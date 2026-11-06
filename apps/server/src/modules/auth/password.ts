import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const keyLength = 64
const cost = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

function derive(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, cost, (error, key) => {
      if (error) reject(error)
      else resolve(key)
    })
  })
}

export function validateNewPassword(password: string) {
  if (password.length < 12 || password.length > 128)
    throw new Error('Passwords must contain 12 to 128 characters.')
}

export async function hashPassword(password: string) {
  validateNewPassword(password)

  const salt = randomBytes(16)
  const key = await derive(password, salt)

  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string | null) {
  const parts = stored?.split('$') ?? []
  const valid =
    parts.length === 3 &&
    parts[0] === 'scrypt' &&
    /^[a-f\d]{32}$/u.test(parts[1]) &&
    /^[a-f\d]{128}$/u.test(parts[2])
  const salt = valid ? Buffer.from(parts[1], 'hex') : Buffer.alloc(16)
  const expected = valid
    ? Buffer.from(parts[2], 'hex')
    : Buffer.alloc(keyLength)
  const actual = await derive(password, salt)

  // 未配置凭据的账号也执行同样的派生工作，避免直接暴露账号是否存在。
  return timingSafeEqual(actual, expected) && valid
}

export const tokenHash = (token: string) =>
  createHash('sha256').update(token).digest('hex')

export const createToken = () => randomBytes(32).toString('base64url')
