import { RIframe } from '@/components/RIframe'
import { mount } from '@vue/test-utils'

describe('RIframe loading strategy', () => {
  it.each([
    [true, 'lazy'],
    [false, 'eager'],
    ['eager', 'eager'],
  ] as const)('sets loading=%s to %s', (lazy, expected) => {
    const wrapper = mount(RIframe, { props: { lazy, src: '/embed.html' } })

    try {
      expect(wrapper.get('iframe').attributes('loading')).toBe(expected)
    } finally {
      wrapper.unmount()
    }
  })
})
