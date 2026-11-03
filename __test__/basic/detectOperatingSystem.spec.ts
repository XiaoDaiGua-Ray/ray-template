import { detectOperatingSystem } from '../../src/utils/basic'

describe('detectOperatingSystem', () => {
  afterEach(() => vi.restoreAllMocks())

  it.each([
    ['Mozilla/5.0 (Linux; Android 14; Pixel 8)', 0, 'Android'],
    ['Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X)', 0, 'IOS'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5, 'IOS'],
    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0, 'MacOS'],
    ['Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 0, 'Windows'],
    ['Mozilla/5.0 (X11; Linux x86_64)', 0, 'Linux'],
    ['Unrecognized', 0, 'Unknown'],
  ])('classifies %s (%s touch points) as %s', (agent, touchPoints, system) => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(agent)
    vi.spyOn(navigator, 'maxTouchPoints', 'get').mockReturnValue(touchPoints)
    expect(detectOperatingSystem()).toBe(system)
  })
})
