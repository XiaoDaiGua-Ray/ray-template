import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { useMaximize } from '../../src/hooks/template/useMaximize'
import { piniaRuntimeStore } from '../../src/store/modules/runtime'

it('shares maximize state across callers and cancels stale completion callbacks', async () => {
  const pinia = createPinia()

  setActivePinia(pinia)

  try {
    const entered = vi.fn()
    const page = useMaximize({ enter: entered, zIndex: 1200 })
    const toolbar = useMaximize()

    page.maximize(true)
    expect(toolbar.isFullscreen.value).toBe(true)
    expect(piniaRuntimeStore().layoutContentMaximizeStyle.zIndex).toBe(1200)
    toolbar.toggleFullscreen()
    await nextTick()
    expect(page.isLayoutContentMaximized.value).toBe(false)
    expect(entered).not.toHaveBeenCalled()
  } finally {
    disposePinia(pinia)
  }
})
