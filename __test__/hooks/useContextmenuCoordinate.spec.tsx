import { useContextmenuCoordinate } from '../../src/hooks/components/useContextmenuCoordinate'
import renderHook from '../utils/renderHook'
import createRefElement from '../utils/createRefElement'

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
})
