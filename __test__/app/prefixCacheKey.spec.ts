import { prefixCacheKey } from '../../src/utils/app/prefix-cache-key'

describe('prefixCacheKey', () => {
  it('should return the key with the default prefix', () => {
    const key = 'signing'

    expect(prefixCacheKey(key)).toBe(key)
  })

  it('should return the key with the custom prefix', () => {
    const key = 'signing'
    const customPrefix = 'ray-'

    expect(prefixCacheKey(key, { customPrefix })).toBe(customPrefix + key)
  })
})
