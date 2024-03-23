import { completeSize } from '../../src/utils/element'

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
