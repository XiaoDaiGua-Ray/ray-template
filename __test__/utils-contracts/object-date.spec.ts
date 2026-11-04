import { getDateByNaiveDatePicker } from '../../apps/admin/src/utils/get-date-by-naive-date-picker'
import { removeDuplicateKeys } from '../../apps/admin/src/utils/remove-duplicate-keys'
import { updateObjectValue } from '../../apps/admin/src/utils/update-object-value'

it('copies only own enumerable keys and preserves Symbol and __proto__ data', () => {
  const symbol = Symbol('meta')
  const input = { ['__proto__']: { inert: true }, [symbol]: 42 }
  const result = removeDuplicateKeys(input)

  expect(result).not.toBe(input)
  expect(result).toEqual(input)
  expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
  expect(Object.hasOwn(result, '__proto__')).toBe(true)
})

it('updates only own properties, shallow merges plain objects, and preserves class values', () => {
  class Sample {
    constructor(readonly id: number) {}
  }

  const value = Object.assign(
    Object.create({ inherited: 1 }) as {
      inherited: number
      plain: { a: number; b?: number }
      sample: Sample
      count: number
    },
    { plain: { a: 1 }, sample: new Sample(1), count: 1 },
  )
  const callback = vi.fn()
  const sample = new Sample(2)

  updateObjectValue(value, 'inherited', 9, callback)
  expect(Object.hasOwn(value, 'inherited')).toBe(false)
  expect(callback).not.toHaveBeenCalled()
  updateObjectValue(value, 'plain', { a: 2, b: 3 }, callback)
  updateObjectValue(value, 'plain', { a: 4 }, callback)
  updateObjectValue(value, 'sample', sample, callback)
  updateObjectValue(value, 'count', 0, callback)
  expect(value.plain).toEqual({ a: 4, b: 3 })
  expect(value.sample).toBe(sample)
  expect(value.count).toBe(0)
  expect(callback).toHaveBeenCalledTimes(4)
})

it('represents cleared ranges as two null endpoints and preserves epoch values', () => {
  expect(getDateByNaiveDatePicker(null, true)).toEqual([null, null])
  expect(getDateByNaiveDatePicker(null, false)).toBeNull()
  expect(getDateByNaiveDatePicker(0, false)).toBe(0)
  const range: [number, number] = [0, 10]

  expect(getDateByNaiveDatePicker(range, true)).toBe(range)
})
