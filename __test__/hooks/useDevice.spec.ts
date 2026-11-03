import { useDevice } from '../../src/hooks/web/useDevice'

describe('useDevice', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
  const matchMediaSpy = vi
    .spyOn(window, 'matchMedia')
    .mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

  beforeEach(() => {
    addEventListenerSpy.mockClear()
    matchMediaSpy.mockClear()
  })

  afterAll(() => {
    addEventListenerSpy.mockRestore()
    matchMediaSpy.mockRestore()
  })

  it('should be defined', () => {
    expect(useDevice).toBeDefined()
  })

  it('should work', () => {
    const { width, height } = useDevice({
      initialWidth: 100,
      initialHeight: 200,
    })

    expect(width.value).toBe(window.innerWidth)
    expect(height.value).toBe(window.innerHeight)
  })

  it('should exclude scrollbar', () => {
    const { width, height } = useDevice({
      initialWidth: 100,
      initialHeight: 200,
      includeScrollbar: false,
    })

    expect(width.value).toBe(window.document.documentElement.clientWidth)
    expect(height.value).toBe(window.document.documentElement.clientHeight)
  })

  it('sets handler for window resize event', async () => {
    useDevice({
      initialWidth: 100,
      initialHeight: 200,
      listenOrientation: false,
    })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledOnce()

    const call = addEventListenerSpy.mock.calls[0]

    expect(call[0]).toEqual('resize')
    expect(call[2]).toEqual({
      passive: true,
    })
  })

  it('sets handler for window.matchMedia("(orientation: portrait)") change event', async () => {
    useDevice({
      initialWidth: 100,
      initialHeight: 200,
    })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)
    expect(matchMediaSpy).toHaveBeenCalledTimes(1)

    const call = matchMediaSpy.mock.calls[0]

    expect(call[0]).toEqual('(orientation: portrait)')
  })

  it('should update width and height on window resize', async () => {
    const { width, height } = useDevice({
      initialWidth: 100,
      initialHeight: 200,
    })

    window.innerWidth = 300
    window.innerHeight = 400

    window.dispatchEvent(new Event('resize'))

    await nextTick()

    expect(width.value).toBe(300)
    expect(height.value).toBe(400)
  })

  it('should update isTabletOrSmaller on window resize', async () => {
    const { isTabletOrSmaller } = useDevice()

    window.innerWidth = 300

    window.dispatchEvent(new Event('resize'))

    await nextTick()

    expect(isTabletOrSmaller.value).toBe(true)
  })
})

it('observes changes at the custom breakpoint and stops after scope disposal', async () => {
  const before = window.innerWidth
  const scope = effectScope()
  const unrelated = ref(0)
  const observer = vi.fn(() => unrelated.value)

  window.innerWidth = 640

  try {
    const state = scope.run(() => useDevice({ media: 640, observer }))!

    await nextTick()
    expect(state.isTabletOrSmaller.value).toBe(true)
    expect(observer).toHaveBeenLastCalledWith(true, {
      width: 640,
      height: window.innerHeight,
    })
    observer.mockClear()
    unrelated.value += 1
    await nextTick()
    expect(observer).not.toHaveBeenCalled()
    window.innerWidth = 641
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(state.isTabletOrSmaller.value).toBe(false)

    scope.stop()
    observer.mockClear()
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(observer).not.toHaveBeenCalled()
  } finally {
    scope.stop()
    window.innerWidth = before
  }
})
