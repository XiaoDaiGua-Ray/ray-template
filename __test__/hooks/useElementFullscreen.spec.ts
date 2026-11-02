import { useElementFullscreen } from '../../src/hooks/web/useElementFullscreen'

// Happy DOM 验证状态与样式恢复；实际布局和动画仍需在浏览器验收。
describe('useElementFullscreen', () => {
  let div: HTMLDivElement

  beforeEach(() => {
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    div.remove()
  })

  it('enters fullscreen and restores the original styles on exit', () => {
    div.style.position = 'relative'
    div.style.width = '240px'
    div.style.transition = 'opacity 1s ease'

    const { enter, exit, isFullscreen } = useElementFullscreen(div)

    enter()

    expect(isFullscreen.value).toBe(true)
    expect(div.getAttribute('data-element-fullscreen')).toBe('true')
    expect(div.style.position).toBe('fixed')
    expect(div.style.transition).toBe('all 0.3s cubic-bezier(0.4, 0, 0.2, 1)')

    exit()

    expect(isFullscreen.value).toBe(false)
    expect(div.hasAttribute('data-element-fullscreen')).toBe(false)
    expect(div.style.position).toBe('relative')
    expect(div.style.width).toBe('240px')
    expect(div.style.transition).toBe('opacity 1s ease')
  })

  it('toggles fullscreen and honors a custom transition', () => {
    const { toggleFullscreen, isFullscreen } = useElementFullscreen(div, {
      transition: 'none',
    })

    toggleFullscreen()

    expect(isFullscreen.value).toBe(true)
    expect(div.style.transition).toBe('none')

    toggleFullscreen()

    expect(isFullscreen.value).toBe(false)
    expect(div.style.transition).toBe('')
  })
})
