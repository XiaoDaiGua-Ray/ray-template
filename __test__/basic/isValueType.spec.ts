import { isValueType } from '../../src/utils/basic'

describe('isValueType', () => {
  it('should return true for string', () => {
    expect(isValueType<string>('string', 'String')).toBe(true)
  })

  it('should return true for number', () => {
    expect(isValueType<number>(123, 'Number')).toBe(true)
  })

  it('should return true for array', () => {
    expect(isValueType<unknown[]>([], 'Array')).toBe(true)
  })

  it('should return true for null', () => {
    expect(isValueType<null>(null, 'Null')).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isValueType<undefined>(void 0, 'Undefined')).toBe(true)
  })

  it('should return true for object', () => {
    expect(isValueType<object>({}, 'Object')).toBe(true)
  })

  it('should return true for Map', () => {
    expect(isValueType<Map<unknown, unknown>>(new Map(), 'Map')).toBe(true)
  })

  it('should return true for Set', () => {
    expect(isValueType<Set<unknown>>(new Set(), 'Set')).toBe(true)
  })

  it('should return true for Date', () => {
    expect(isValueType<Date>(new Date(), 'Date')).toBe(true)
  })

  it('should return true for RegExp', () => {
    expect(isValueType<RegExp>(/a/i, 'RegExp')).toBe(true)
  })

  it('should return false for Function', () => {
    expect(isValueType<Function>(/a/i, 'Function')).toBe(false)
  })
})
