import { pick } from '../../src/utils/basic'

describe('pick', () => {
  it('should pick keys from object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, 'a', 'c')

    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should pick keys from the array argument', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['a', 'c'])

    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('an empty object should be returned if null or undefined is passed', () => {
    const result1 = pick(null)
    const result2 = pick(void 0)

    expect(result1).toEqual({})
    expect(result2).toEqual({})
  })
})
