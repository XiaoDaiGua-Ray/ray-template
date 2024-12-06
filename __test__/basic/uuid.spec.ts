import { uuid } from '../../src/utils/basic'

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
