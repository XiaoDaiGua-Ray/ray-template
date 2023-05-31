import { LAYOUT_CONTENT_REF } from '@/appConfig/routerConfig'

import type { RouteLocationNormalized } from 'vue-router'

/**
 *
 * 切换路由时, 手动将容器区域回归默认值
 *
 * 由于官方不支持这个方法了, 所以自己手写了一个
 * 如果需要忽略恢复默认位置, 仅需要在 meta 中配置 ignoreAutoResetScroll 属性即可
 */
const scrollViewToTop = (route: RouteLocationNormalized) => {
  const { meta } = route

  /** 这个 id 是注入在 layout 中 */
  if (!meta?.ignoreAutoResetScroll) {
    LAYOUT_CONTENT_REF.value?.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }
}

export default scrollViewToTop
