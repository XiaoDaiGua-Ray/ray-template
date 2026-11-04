import { removeStyle, setStyle } from '../../apps/admin/src/utils/element'
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

it('keeps existing styles, parses complete CSS values, and removes camelCase names', () => {
  const element = document.createElement('div')

  element.style.color = 'red'
  setStyle(element, { zIndex: 3, '--Token': 'large' })
  expect(element.style.zIndex).toBe('3')
  expect(element.style.getPropertyValue('--Token')).toBe('large')
  setStyle(
    element,
    'width: 20px !important; background-image: url("https://example.test/a:b");',
  )
  expect(element.style.color).toBe('red')
  expect(element.style.getPropertyPriority('width')).toBe('important')
  expect(element.style.backgroundImage).toContain('https://example.test/a:b')
  removeStyle(element, ['zIndex', '--Token', 'backgroundImage'])
  expect(element.style.zIndex).toBe('')
  expect(element.style.getPropertyValue('--Token')).toBe('')
  expect(element.style.backgroundImage).toBe('')
})
