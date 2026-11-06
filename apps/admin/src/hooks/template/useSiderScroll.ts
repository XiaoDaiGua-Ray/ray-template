import { LAYOUT_SIDER_REF } from '@/app-config'
import type { LayoutInst } from 'naive-ui'

/**
 *
 * @returns 侧栏 scrollTo；调用时读取当前布局实例，未挂载时不操作。
 */
export const useSiderScroll = () => {
  /**
   *
   * @param options 横向坐标或 Naive UI 滚动选项
   * @param y 数字坐标模式下的纵向坐标，默认 0
   *
   * @description
   * 调用时解析当前侧栏；没有侧栏或侧栏未挂载时不操作。
   */
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
