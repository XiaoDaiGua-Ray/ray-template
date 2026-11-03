import { LAYOUT_SIDER_REF } from '@/app-config'
import type { LayoutInst } from 'naive-ui'

/**
 *
 * @description
 * 滚动侧边栏。
 *
 * @see https://www.naiveui.com/zh-CN/dark/components/layout#scroll-to.vue
 *
 * @example
 * const siderScrollTo = useSiderScroll()
 *
 * siderScrollTo({ top: 0, behavior: 'smooth' }) // y 方向侧边栏滚动
 * siderScrollTo(0, 0) // x, y 方向滚动到 0 位置
 */
export const useSiderScroll = () => {
  const scrollTo: LayoutInst['scrollTo'] = (
    options: number | object,
    y?: number,
  ) => {
    const sider = LAYOUT_SIDER_REF.value

    if (typeof options === 'number') sider?.scrollTo(options, y ?? 0)
    else sider?.scrollTo(options)
  }

  return scrollTo
}
