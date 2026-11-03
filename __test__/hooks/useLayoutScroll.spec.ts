import type { LayoutInst } from 'naive-ui'
import type { Ref } from 'vue'
import { LAYOUT_CONTENT_REF, LAYOUT_SIDER_REF } from '../../src/app-config'
import { useContentScroll } from '../../src/hooks/template/useContentScroll'
import { useSiderScroll } from '../../src/hooks/template/useSiderScroll'

describe.each([
  [useContentScroll, LAYOUT_CONTENT_REF],
  [useSiderScroll, LAYOUT_SIDER_REF],
] as const)('layout scrolling', (useScroll, target) => {
  const writable = target as Ref<LayoutInst | null>

  afterEach(() => {
    writable.value = null
  })

  it('can be created before mount and follows replacement layout instances', () => {
    writable.value = null
    const scroll = useScroll()

    expect(() => scroll({ top: 0 })).not.toThrow()
    const first = vi.fn()

    writable.value = { scrollTo: first } as unknown as LayoutInst
    scroll({ top: 10 })
    expect(first).toHaveBeenCalledWith({ top: 10 })
    const second = vi.fn()

    writable.value = { scrollTo: second } as unknown as LayoutInst
    scroll(0, 300)
    expect(second).toHaveBeenCalledWith(0, 300)
    expect(first).toHaveBeenCalledTimes(1)
  })
})
