import { RQRCode } from '../../src/components/RQRCode/index'
import { mount } from '@vue/test-utils'

describe('RQRCode', () => {
  it('should render a qr code', () => {
    const wrapper = mount(RQRCode, {
      props: {
        text: 'hi',
      },
    })

    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should execute the callback', () => {
    let successValue: 1
    let errorValue: -1

    const _success = vitest.fn()
    const _error = vitest.fn()

    _success.mockReturnValue(1)
    _error.mockReturnValue(-1)

    mount(RQRCode, {
      props: {
        text: 'hi',
        onSuccess: () => {
          successValue = _success()

          expect(successValue).toBe(1)
        },
        onError: () => {
          errorValue = _error()

          expect(errorValue).toBe(-1)
        },
      },
    })
  })

  it('should execute the onReload function', async () => {
    let count = 0

    const wrapper = mount(RQRCode, {
      props: {
        text: 'hi',
        status: 'error',
        onReload: () => {
          count = 1
        },
      },
    })

    const btn = wrapper.find('.n-button')

    btn.trigger('click')

    expect(count).toBe(1)
  })
})
