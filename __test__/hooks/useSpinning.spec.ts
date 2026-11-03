import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { useSpinning } from '../../src/hooks/template/useSpinning'
import { piniaRuntimeStore } from '../../src/store/modules/runtime'

describe('useSpinning', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    vi.useFakeTimers()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    disposePinia(pinia)
    vi.useRealTimers()
  })

  it('opens and closes the content spinner without remounting the page', () => {
    const { openSpin, closeSpin } = useSpinning()
    const store = piniaRuntimeStore()

    openSpin()
    expect(store.layoutContentSpinning).toBe(true)
    expect(store.globalMainLayoutLoad).toBe(true)
    closeSpin()
    expect(store.layoutContentSpinning).toBe(false)
  })

  it('keeps a remount pending until the latest reload finishes, across callers', () => {
    const store = piniaRuntimeStore()

    useSpinning().reload(1000)
    vi.advanceTimersByTime(500)
    useSpinning().reload(1000)
    vi.advanceTimersByTime(500)
    expect(store.globalMainLayoutLoad).toBe(false)
    vi.advanceTimersByTime(500)
    expect(store.globalMainLayoutLoad).toBe(true)
  })

  it('disposes timers and isolates runtime state between applications', () => {
    useSpinning().reload()
    disposePinia(pinia)
    expect(vi.getTimerCount()).toBe(0)
    pinia = createPinia()
    setActivePinia(pinia)
    expect(piniaRuntimeStore().globalMainLayoutLoad).toBe(true)
  })
})
