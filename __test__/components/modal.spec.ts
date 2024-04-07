import { RModal } from '../../src/components/RModal/index'
import { mount } from '@vue/test-utils'

describe('RModal', () => {
  it('should execute the onAfterEnter callback', () => {
    mount(RModal, {
      props: {
        show: true,
        onAfterEnter: () => {
          assert(true)
        },
      },
      slots: {
        default: h('div', 'Hello World'),
      },
    })
  })

  it('should render a modal', async () => {
    const wrapper = mount(RModal, {
      props: {
        show: true,
      },
      slots: {
        default: h('div', 'Hello World'),
      },
    })
    const classStr = 'n-modal-container'

    const modal = document.body.querySelector(`.${classStr}`)
    const modalClassList = Array.from(modal?.classList || [])

    expect(modalClassList.length).not.toBe(0)
    expect(modalClassList.includes(classStr)).toBe(true)
  })
})
