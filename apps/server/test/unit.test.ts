import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { test } from 'node:test'
import { userInputSchema } from '@ray-template/api-contracts/admin'
import { SignJWT } from 'jose'
import { ApiError, parseInput, queryInput } from '../src/http'
import { signSession, verifySession } from '../src/modules/auth/jwt'
import {
  hashPassword,
  tokenHash,
  validateNewPassword,
  verifyPassword,
} from '../src/modules/auth/password'

test('password credentials use independent salts and reject corrupt or incorrect credentials', async () => {
  const password = `unit-${randomBytes(24).toString('base64url')}`
  const first = await hashPassword(password)
  const second = await hashPassword(password)

  assert.notEqual(first, second)
  assert.equal(first.includes(password), false)
  assert.equal(await verifyPassword(password, first), true)
  assert.equal(await verifyPassword(`${password}wrong`, first), false)
  assert.equal(await verifyPassword(password, null), false)
  assert.equal(await verifyPassword(password, 'scrypt$bad$bad'), false)
  assert.throws(() => validateNewPassword('short'))
  assert.throws(() => validateNewPassword('x'.repeat(129)))
})

test('JWTs are distinct and reject tampering, expiry and a mismatched signing policy', async () => {
  const secret = randomBytes(32)
  const { token: first } = await signSession(secret, 'account-1', 60)
  const { token: second } = await signSession(secret, 'account-1', 60)
  const { token: expired } = await signSession(secret, 'account-1', -1)
  const tampered = first.replace(/\.[^.]+$/u, `.${'A'.repeat(43)}`)
  const wrongAudience = await new SignJWT()
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer('ray-template')
    .setAudience('other-app')
    .setSubject('account-1')
    .setIssuedAt()
    .setJti('wrong-audience')
    .setExpirationTime('1m')
    .sign(secret)

  assert.notEqual(first, second)
  assert.notEqual(tokenHash(first), first)
  assert.equal(tokenHash(first), tokenHash(first))
  assert.notEqual(tokenHash(first), tokenHash(second))
  assert.equal(await verifySession(secret, first), 'account-1')

  for (const token of [tampered, expired, wrongAudience])
    assert.equal(await verifySession(secret, token), void 0)

  assert.equal(await verifySession(randomBytes(32), first), void 0)
})

test('HTTP query conversion rejects arrays and ambiguous numeric strings', () => {
  assert.deepEqual(queryInput({ page: '2', pageSize: '25', name: 'Alex' }), {
    page: 2,
    pageSize: 25,
    name: 'Alex',
  })
  assert.throws(() => queryInput({ page: ['1', '2'] }), ApiError)
  assert.throws(() => queryInput({ pageSize: '1e2' }), ApiError)
  assert.throws(() => queryInput({ page: '' }), ApiError)
  assert.throws(
    () => parseInput(userInputSchema, { username: 'bad' }),
    ApiError,
  )
})
