import { completeSize } from '../../apps/admin/src/utils/element'

describe('completeSize', () => {
  it('should be defined', () => {
    expect(completeSize).toBeDefined()
  })

  it('should return size', () => {
    expect(completeSize('100px')).toBe('100px')
    expect(completeSize('100%')).toBe('100%')
    expect(completeSize('100vw')).toBe('100vw')
  })

  it('should return default size', () => {
    expect(completeSize(0)).toBe('0px')
  })
})

it('only adds a unit to numbers and preserves valid CSS expressions and keywords', () => {
  expect(completeSize(' 12.5 ', 'rem')).toBe('12.5rem')
  expect(completeSize('-.5')).toBe('-.5px')
  expect(completeSize('calc(100% - 2rem)')).toBe('calc(100% - 2rem)')
  expect(completeSize('var(--card-width)')).toBe('var(--card-width)')
  expect(completeSize('fit-content')).toBe('fit-content')
})
