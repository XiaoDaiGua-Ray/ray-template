import { LAYOUT_SIDER_REF } from '@/app-config'

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
  const siderInst = LAYOUT_SIDER_REF.value
  const { scrollTo: siderScrollTo } = siderInst || {}

  if (!siderScrollTo) {
    throw new Error(
      `[useSiderScroll]: LAYOUT_SIDER_REF is not ready yet. please wait component mounted!`,
    )
  }

  return siderScrollTo
}
