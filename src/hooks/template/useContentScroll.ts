import { LAYOUT_CONTENT_REF } from '@/app-config'

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
  const contentInst = LAYOUT_CONTENT_REF.value

  const { scrollTo: contentScrollTo } = contentInst || {}

  if (!contentScrollTo) {
    throw new Error(
      `[useContentScroll]: LAYOUT_CONTENT_REF is not ready yet. please wait component mounted!`,
    )
  }

  return contentScrollTo
}
