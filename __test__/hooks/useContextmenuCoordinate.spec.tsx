import { useContextmenuCoordinate } from '../../src/hooks/components/useContextmenuCoordinate'
import createRefElement from '../utils/createRefElement'
import renderHook from '../utils/renderHook'

describe('useContextmenuCoordinate', () => {
  const wrapperRef = createRefElement()
  const [result] = renderHook(() =>
    useContextmenuCoordinate(wrapperRef.element),
  )

  it('should be defined', () => {
    expect(useContextmenuCoordinate).toBeDefined()
  })

  it('should update show value to true when contextmenu event is triggered', async () => {
    wrapperRef.element.dispatchEvent(new MouseEvent('contextmenu'))

    await nextTick()

    expect(result.show.value).toBe(true)
  })

  it('should update show value when calling updateShow method', async () => {
    result.updateShow(false)

    await nextTick()

    expect(result.show.value).toBe(false)

    result.updateShow(true)

    await nextTick()

    expect(result.show.value).toBe(true)
  })

  it('should get the clientX and clientY value when contextmenu event is triggered', async () => {
    const event = new MouseEvent('contextmenu', {
      clientX: 100,
      clientY: 200,
    })

    wrapperRef.element.dispatchEvent(event)

    await nextTick()

    expect(result.x.value).toBe(100)
    expect(result.y.value).toBe(200)
  })
  it('does not reopen after stop interrupts a pending context-menu event', async () => {
    const target = document.createElement('div')
    const [menu, app] = renderHook(() => useContextmenuCoordinate(target))

    target.dispatchEvent(new MouseEvent('contextmenu'))
    menu.stop()
    await nextTick()
    expect(menu.show.value).toBe(false)
    target.dispatchEvent(new MouseEvent('contextmenu'))
    await nextTick()
    expect(menu.show.value).toBe(false)
    app.unmount()
  })
})

it('honors the outside handler, prevents the native menu and cannot reopen after disposal', async () => {
  const target = document.createElement('div')
  const outside = document.createElement('button')

  document.body.append(target, outside)
  const clickOutside = vi.fn()
  const [menu, app] = renderHook(() =>
    useContextmenuCoordinate(target, { clickOutside, passive: true }),
  )

  try {
    const event = new MouseEvent('contextmenu', {
      cancelable: true,
      clientX: 14,
    })

    target.dispatchEvent(event)
    await nextTick()
    expect(event.defaultPrevented).toBe(true)
    expect(menu.show.value).toBe(true)
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(clickOutside).toHaveBeenCalledOnce()
    expect(menu.show.value).toBe(false)
    menu.stop()
    menu.updateShow(true)
    expect(menu.show.value).toBe(false)
  } finally {
    app.unmount()
    target.remove()
    outside.remove()
  }
})
