import { LAYOUT_CONTENT_REF } from '@/app-config'
import type { RouteLocationNormalized } from 'vue-router'

/**
 *
 * @param route 路由对象
 *
 * @description
 * 当路由切换后自动将内容区域滚动到顶部（x、y都会归于 0）；
 * 如果需要忽略该功能，可以在路由的 meta 中配置 ignoreAutoResetScroll 属性。
 *
 * @example
 * scrollViewToTop({
 *   meta: { ignoreAutoResetScroll: true }
 * }) // 不会滚动到顶部，维持上一次的滚动位置
 */
export const scrollViewToTop = (route: RouteLocationNormalized) => {
  const { meta } = route

  /** LAYOUT_CONTENT_REF */
  if (!meta?.ignoreAutoResetScroll) {
    LAYOUT_CONTENT_REF.value?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}
