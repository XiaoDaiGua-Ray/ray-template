import { uuid } from '../../apps/admin/src/utils/basic'

describe('uuid', () => {
  it('should return String', () => {
    expectTypeOf(uuid()).toEqualTypeOf<string>()
  })

  it('the return value should be unique', () => {
    const uuid1 = uuid()
    const uuid2 = uuid()

    expect(uuid1).not.toBe(uuid2)
  })

  it('should return a string with length 36', () => {
    const uid = uuid(36)

    expect(uid.length).toBe(36)
  })
})

it('enforces the requested radix and rejects invalid bounds', () => {
  expect(uuid(16, 1)).toBe('0'.repeat(16))
  expect(uuid(24, 10)).toMatch(/^\d{24}$/)
  expect(uuid(0)).toBe('')

  for (const radix of [0, -1, 63, 1.1, NaN]) {
    expect(() => uuid(8, radix)).toThrow(RangeError)
  }

  expect(() => uuid(-1)).toThrow(RangeError)
  expect(() => uuid(Infinity)).toThrow(RangeError)
})
