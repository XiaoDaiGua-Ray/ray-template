import { getAppEnvironment } from '../../src/utils/basic'

describe('getAppEnvironment', () => {
  it('should return MODE is test', () => {
    const { MODE } = getAppEnvironment()

    expect(MODE).toBe('test')
  })

  it('SSR should be false', () => {
    const { SSR } = getAppEnvironment()

    expect(SSR).toBe(false)
  })

  it('deconstruction value should be undefined', () => {
    const { UNDEFINED_MODE } = getAppEnvironment()

    expect(UNDEFINED_MODE).toBe(void 0)
  })
})
