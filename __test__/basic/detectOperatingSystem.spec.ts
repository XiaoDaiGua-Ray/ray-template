import { detectOperatingSystem } from '../../src/utils/basic'

describe('detectOperatingSystem', () => {
  it('should return Unknown', () => {
    expect(detectOperatingSystem()).toBe('Unknown')
  })
})
