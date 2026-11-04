import {
  add,
  distribute,
  divide,
  format,
  isCurrency,
  multiply,
  subtract,
} from '../../apps/admin/src/utils/precision'

describe('precision', () => {
  it('check value is currency object', () => {
    expect(isCurrency(1)).toBeFalsy()
    expect(isCurrency('1')).toBeFalsy()
    expect(isCurrency({})).toBeFalsy()
    expect(isCurrency({ s: 1 })).toBeFalsy()
    expect(isCurrency(add(1, 1))).toBeTruthy()
  })

  it('format value', () => {
    expect(format(1)).toBe(1)
    expect(
      format(1.1, {
        type: 'number',
      }),
    ).toBe(1.1)
    expect(
      format(1.11, {
        type: 'string',
        precision: 2,
      }),
    ).toBe('1.11')
    expect(format(add(1, 1))).toBe(2)
    expect(format(add(0.1, 0.2))).toBe(0.3)
  })

  it('add value', () => {
    expect(format(add(1, 1))).toBe(2)
    expect(format(add(0.1, 0.2))).toBe(0.3)
    expect(format(add(0.1, 0.2, 0.3))).toBe(0.6)
    expect(format(add(0.1, 0.2, 0.3, 0.4))).toBe(1)
    expect(format(add(0.1, 0.2, 0.3, 0.4, 0.5))).toBe(1.5)
  })

  it('subtract value', () => {
    expect(format(subtract(1, 1))).toBe(0)
    expect(format(subtract(0.3, 0.2))).toBe(0.1)
    expect(format(subtract(0.6, 0.3, 0.2))).toBe(0.1)
    expect(format(subtract(1, 0.5, 0.4, 0.3, 0.2))).toBe(-0.4)
  })

  it('multiply value', () => {
    expect(format(multiply(1, 1))).toBe(1)
    expect(format(multiply(0.1, 0.2))).toBe(0.02)
    expect(format(multiply(0.1, 0.2, 0.3))).toBe(0.006)
    expect(format(multiply(0.1, 0.2, 0.3, 0.4))).toBe(0.0024)
    expect(format(multiply(0.1, 0.2, 0.3, 0.4, 0.5))).toBe(0.0012)
  })

  it('divide value', () => {
    expect(format(divide(1, 1))).toBe(1)
    expect(format(divide(0.1, 0.2))).toBe(0.5)
    expect(
      format(divide(0.1, 0.2, 0.3), {
        precision: 2,
      }),
    ).toBe(1.67)
  })

  it('distribute value', () => {
    expect(distribute(1, 1)).toEqual([1])
    expect(distribute(1, 0)).toEqual([1])
    expect(distribute(0, 3)).toEqual([0, 0, 0])
    expect(distribute(10, 3)).toEqual([3.33333334, 3.33333333, 3.33333333])
    expect(
      distribute(20, 3, {
        precision: 4,
      }),
    ).toEqual([6.6667, 6.6667, 6.6666])
    expect(distribute(add(20, 1), 3)).toEqual([7, 7, 7])
  })
})

it('handles empty, single and mixed input without losing input order', () => {
  for (const operation of [add, subtract, multiply, divide]) {
    expect(operation().value).toBe(0)
    expect(operation('1.125').value).toBe(1.125)
  }

  expect(multiply(add(1, 1), add(1, 2), '0.5').value).toBe(3)
  expect(divide(24, 3, 2).value).toBe(4)
  expect(subtract(20, 3, 2).value).toBe(15)
  expect(() => divide(1, 0)).toThrow(RangeError)
})

it('preserves signed remainders, formats one portion, and rejects invalid counts', () => {
  expect(distribute(-10, 3, { precision: 2 })).toEqual([-3.34, -3.33, -3.33])
  expect(distribute('2.1', 1, { precision: 2, type: 'string' })).toEqual([
    '2.10',
  ])
  expect(distribute(0, 2, { precision: 2, type: 'string' })).toEqual([
    '0.00',
    '0.00',
  ])
  expect(() => distribute(1, 1.5)).toThrow(RangeError)
  expect(() => distribute(1, Infinity)).toThrow(RangeError)
})
