import { useElementBounding } from '@vueuse/core'

import type { Ref } from 'vue'

/**
 *
 * @description
 * 动态获取 SiderBar 和 MenuTag 高度，用于 LayoutContent 高度实时获取与渲染；
 * 可以动态更改 MenuTag 样式后，使得 LayoutContent 也可以准确的获取高度。
 */
export const layoutCssVars = (
  element: [
    Ref<HTMLElement | undefined>,
    Ref<HTMLElement | undefined>,
    Ref<HTMLElement | undefined>,
  ],
) => {
  const siderBar = useElementBounding(element[0])
  const menuTag = useElementBounding(element[1])
  const footer = useElementBounding(element[2])

  return computed(() => {
    return {
      '--window-width': 'var(--html-width)',
      '--window-height': 'var(--html-height)',
      '--layout-content-height': `calc(var(--html-height) - ${siderBar.height.value}px - ${menuTag.height.value}px - ${footer.height.value}px)`,
      '--layout-content-width': `${siderBar.width.value}px`,
      '--layout-siderbar-height': `${siderBar.height.value}px`,
      '--layout-menutag-height': `${menuTag.height.value}px`,
      '--layout-footer-height': `${footer.height.value}px`,
    }
  })
}
