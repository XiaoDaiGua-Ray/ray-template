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
  it('cancels a pending animation frame when exiting immediately', () => {
    vi.useFakeTimers()
    div.style.width = '240px'
    const { enter, exit } = useElementFullscreen(div)

    enter()
    exit()
    vi.runAllTimers()
    expect(div.style.width).toBe('240px')
    expect(div.style.position).toBe('')
    vi.useRealTimers()
  })

  it('restores the original element if the target ref changes while fullscreen', () => {
    const target = ref(div)
    const { enter, exit } = useElementFullscreen(target)

    enter()
    target.value = document.createElement('div')
    exit()
    expect(div.hasAttribute('data-element-fullscreen')).toBe(false)
    expect(div.style.position).toBe('')
  })
  it('keeps transitions retryable when a before callback rejects the action', () => {
    const beforeEnter = vi.fn().mockImplementationOnce(() => {
      throw new Error('enter refused')
    })
    const beforeExit = vi.fn().mockImplementationOnce(() => {
      throw new Error('exit refused')
    })
    const { enter, exit, isFullscreen } = useElementFullscreen(div, {
      beforeEnter,
      beforeExit,
    })

    expect(enter).toThrow('enter refused')
    expect(isFullscreen.value).toBe(false)
    enter()
    expect(isFullscreen.value).toBe(true)
    expect(exit).toThrow('exit refused')
    expect(isFullscreen.value).toBe(true)
    exit()
    expect(isFullscreen.value).toBe(false)
    expect(div.style.position).toBe('')
  })
})
