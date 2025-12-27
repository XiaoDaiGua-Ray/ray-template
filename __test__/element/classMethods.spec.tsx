import { hasClass, removeClass, setClass } from '../../src/utils/element'
import createRefElement from '../utils/createRefElement'

describe('setClass', () => {
  const wrapper = createRefElement()
  const CLASS_NAME = 'test'
  const CLASS_NAME_2 = 'test2'

  it('set ref element class', () => {
    setClass(wrapper.element, CLASS_NAME)

    const classList = Array.from(wrapper.element.classList)

    expect(classList.includes(CLASS_NAME)).toBe(true)
  })

  it('set ref element class with multiple class names', () => {
    setClass(wrapper.element, `${CLASS_NAME} ${CLASS_NAME_2}`)

    const classList = Array.from(wrapper.element.classList)

    expect(classList.includes(CLASS_NAME)).toBe(true)
    expect(classList.includes(CLASS_NAME_2)).toBe(true)
  })

  it('set ref element class with multiple class names use array params', () => {
    setClass(wrapper.element, [CLASS_NAME, CLASS_NAME_2])

    const classList = Array.from(wrapper.element.classList)

    expect(classList.includes(CLASS_NAME)).toBe(true)
    expect(classList.includes(CLASS_NAME_2)).toBe(true)
  })

  it('get ref element class', () => {
    setClass(wrapper.element, CLASS_NAME)

    const hasClassResult = hasClass(wrapper.element, CLASS_NAME)

    expect(hasClassResult.value).toBe(true)
  })

  it('get ref element class with multiple class names', () => {
    setClass(wrapper.element, `${CLASS_NAME} ${CLASS_NAME_2}`)

    const hasClassResult = hasClass(wrapper.element, CLASS_NAME)

    expect(hasClassResult.value).toBe(true)
  })

  it('get ref element class with multiple class names use array params', () => {
    setClass(wrapper.element, [CLASS_NAME, CLASS_NAME_2])

    const hasClassResult = hasClass(wrapper.element, CLASS_NAME)

    expect(hasClassResult.value).toBe(true)
  })

  it('remove ref element class', () => {
    setClass(wrapper.element, CLASS_NAME)

    removeClass(wrapper.element, CLASS_NAME)

    const classList = Array.from(wrapper.element.classList)

    expect(classList.includes(CLASS_NAME)).toBe(false)
  })
})
