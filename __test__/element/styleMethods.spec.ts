import { removeStyle, setStyle } from '../../src/utils/element'
import createRefElement from '../utils/createRefElement'

describe('setStyle', () => {
  const div = document.createElement('div')
  const removeKeys = ['width', 'height']
  const wrapper = createRefElement()

  document.body.appendChild(div)

  it('should be defined', () => {
    expect(setStyle).toBeDefined()
  })

  it('should set style', () => {
    removeStyle(div, removeKeys)

    setStyle(div, {
      width: '100px',
      height: '100px',
    })

    expect(div.style.width).toBe('100px')
    expect(div.style.height).toBe('100px')
  })

  it('should set style with string', () => {
    removeStyle(div, removeKeys)

    setStyle(div, 'width: 100px; height: 100px;')

    expect(div.style.width).toBe('100px')
    expect(div.style.height).toBe('100px')
  })

  it('should set style with string array', () => {
    removeStyle(div, removeKeys)

    setStyle(div, ['width: 100px', 'height: 100px'])

    expect(div.style.width).toBe('100px')
    expect(div.style.height).toBe('100px')
  })

  it('should set style with css variable', () => {
    removeStyle(div, ['--width', '--height'])

    setStyle(div, {
      '--width': '100px',
      '--height': '100px',
    })

    expect(div.style.getPropertyValue('--width')).toBe('100px')
    expect(div.style.getPropertyValue('--height')).toBe('100px')
  })

  it('should set style to ref element', () => {
    const element = wrapper.vm.domRef as HTMLElement
    const style = element.style

    removeStyle(element, removeKeys)

    setStyle(element, {
      width: '100px',
      height: '100px',
    })

    expect(style.width).toBe('100px')
    expect(style.height).toBe('100px')
  })
})
