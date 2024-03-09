/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { useElementBounding } from '@vueuse/core'

import type { Ref } from 'vue'

/**
 *
 * 动态获取 SiderBar 和 MenuTag 高度, 用于 LayoutContent 高度实时获取与渲染
 * 可以动态更改 MenuTag 样式后, 使得 LayoutContent 也可以准确的获取高度
 *
 * 基于 vueuse useElementSize 方法实现
 * 不建议滥用该方法, 对页面渲染有一定的影响
 */
export const layoutHeaderCssVars = (
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
      '--layout-content-height': `calc(100% - ${siderBar.height.value}px - ${menuTag.height.value}px - ${footer.height.value}px)`,
      '--layout-siderbar-height': `${siderBar.height.value}px`,
      '--layout-menutag-height': `${menuTag.height.value}px`,
      '--layout-footer-height': `${footer.height.value}px`,
    }
  })
}
