import { LAYOUT_CONTENT_REF } from '@/app-config'
import type { LayoutInst } from 'naive-ui'

/**
 *
 * @description
 * 滚动侧边栏、内容区域。
 *
 * @see https://www.naiveui.com/zh-CN/dark/components/layout#scroll-to.vue
 *
 * @example
 * const contentScrollTo = useContentScroll()
 *
 * contentScrollTo({ top: 0, left: 0, behavior: 'smooth' }) // 滚动内容区域
 * contentScrollTo(10, 10) // x, y 方向滚动到 10 位置
 */
export const useContentScroll = () => {
  // 在事件触发时读取当前实例，支持 setup 中调用和布局重新挂载。
  const scrollTo: LayoutInst['scrollTo'] = (
    options: number | object,
    y?: number,
  ) => {
    const content = LAYOUT_CONTENT_REF.value

    if (typeof options === 'number') content?.scrollTo(options, y ?? 0)
    else content?.scrollTo(options)
  }

  return scrollTo
}
