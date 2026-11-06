import { randomUUID } from 'node:crypto'
import { jwtVerify, SignJWT } from 'jose'

const algorithm = 'HS256'
const issuer = 'ray-template'
const audience = 'ray-admin'
const type = 'JWT'

export async function signSession(
  secret: Uint8Array,
  userId: string,
  ttl: number,
) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiration = issuedAt + ttl
  const token = await new SignJWT()
    .setProtectedHeader({ alg: algorithm, typ: type })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiration)
    .sign(secret)

  return { token, expiresAt: new Date(expiration * 1000) }
}

export async function verifySession(secret: Uint8Array, token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [algorithm],
      issuer,
      audience,
      typ: type,
      requiredClaims: ['sub', 'jti', 'iat', 'exp'],
    })

    if (typeof payload.sub === 'string' && typeof payload.jti === 'string')
      return payload.sub
  } catch {
    // 校验失败统一按无效会话处理，避免暴露签名和过期细节。
  }
}
