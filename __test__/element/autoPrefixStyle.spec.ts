import { autoPrefixStyle } from '../../src/utils/element'

describe('autoPrefixStyle', () => {
  it('should be defined', () => {
    expect(autoPrefixStyle).toBeDefined()
  })

  it('should complete css prefix', () => {
    const result = autoPrefixStyle('transform')

    expect(result).toEqual({
      webkitTransform: 'transform',
      mozTransform: 'transform',
      msTransform: 'transform',
      oTransform: 'transform',
      transform: 'transform',
    })
  })
})
