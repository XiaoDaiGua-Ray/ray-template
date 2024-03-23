import { colorToRgba } from '../../src/utils/element'

describe('colorToRgba', () => {
  it('should be defined', () => {
    expect(colorToRgba).toBeDefined()
  })

  it('should return rgba color', () => {
    expect(colorToRgba('rgb(255, 255, 255)', 0.5)).toBe(
      'rgba(255, 255, 255, 0.5)',
    )
    expect(colorToRgba('rgba(255, 255, 255, 0.5)', 0.5)).toBe(
      'rgba(255, 255, 255, 0.5)',
    )
    expect(colorToRgba('#fff', 0.1)).toBe('rgba(255, 255, 255, 0.1)')
    expect(colorToRgba('#000000', 0.1)).toBe('rgba(0, 0, 0, 0.1)')
    expect(colorToRgba('#fffffafa', 0.1)).toBe('rgba(255, 255, 250, 0.98)')
  })

  it('should return input color', () => {
    expect(colorToRgba('hi')).toBe('hi')
  })
})
