import { useElementFullscreen } from '../../src/hooks/web/useElementFullscreen'

describe('useElementFullscreen', async () => {
  const div = document.createElement('div')
  const transition = 'all 0.3s var(--r-bezier)'
  const __ID__ = '__ID__'

  div.setAttribute('id', __ID__)
  document.body.appendChild(div)

  const resetDivStyle = () => {
    const element = document.getElementById(__ID__)

    if (element) {
      element.style.transition = ''
    }
  }

  const { enter, exit, toggleFullscreen } = useElementFullscreen(div)

  it('should enter fullscreen', async () => {
    resetDivStyle()
    enter()

    await nextTick()

    expect(div.style.transition).toBe(transition)
  })

  it('should exit fullscreen', async () => {
    resetDivStyle()
    exit()

    await nextTick()

    expect(div.style.transition).toBe('')
  })

  it('should toggle fullscreen', async () => {
    resetDivStyle()
    enter()
    enter() // 为了兼容测试环境，故而调用两次

    await nextTick()

    expect(div.style.transition).toBe(transition)

    toggleFullscreen()

    await nextTick()

    expect(div.style.transition).toBe('')
  })
})
