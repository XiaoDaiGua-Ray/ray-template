import assert from 'node:assert/strict'
import { test } from 'node:test'
import { userInputSchema } from '@ray-template/api-contracts/admin'
import { ApiError, parseInput, queryInput } from '../src/http'
import {
  createToken,
  hashPassword,
  tokenHash,
  validateNewPassword,
  verifyPassword,
} from '../src/modules/auth/password'

test('password credentials use independent salts and reject corrupt or incorrect credentials', async () => {
  const password = `unit-${createToken()}`
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

test('session tokens are unguessable identifiers and only their digest is persisted', () => {
  const first = createToken()
  const second = createToken()

  assert.notEqual(first, second)
  assert.notEqual(tokenHash(first), first)
  assert.equal(tokenHash(first), tokenHash(first))
  assert.notEqual(tokenHash(first), tokenHash(second))
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
