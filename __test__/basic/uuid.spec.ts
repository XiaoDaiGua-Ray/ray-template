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

it('rejects biased samples while filling identifiers across several batches', () => {
  let batch = 0
  const random = vi
    .spyOn(crypto, 'getRandomValues')
    .mockImplementation((samples) => {
      const values = samples as Uint32Array

      values.fill(batch++ === 0 ? 0xffffffff : 9)

      return samples
    })

  try {
    expect(uuid(257, 10)).toBe('9'.repeat(257))
  } finally {
    random.mockRestore()
  }
})

it('supports long identifiers without exceeding the Web Crypto byte quota', () => {
  expect(uuid(70000, 10)).toMatch(/^\d{70000}$/)
})
