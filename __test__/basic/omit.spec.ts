import { omit } from '../../src/utils/basic'

describe('omit', () => {
  it('should omit key from object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, 'b')

    expect(result).toEqual({ a: 1, c: 3 })
  })

  it('should omit key from the array argument', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['a', 'c'])

    expect(result).toEqual({ b: 2 })
  })

  it('should return empty object if no keys are provided', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, Object.keys(obj))

    expect(result).toEqual({})
  })

  it('should return empty object if object is empty', () => {
    const obj = {}
    const result = omit(obj, 'a', 'b')

    expect(result).toEqual({})
  })

  it('an empty object should be returned if null or undefined is passed', () => {
    const result1 = omit(null)
    const result2 = omit(void 0)

    expect(result1).toEqual({})
    expect(result2).toEqual({})
  })
})
