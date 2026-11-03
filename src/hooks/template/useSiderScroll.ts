import { LAYOUT_SIDER_REF } from '@/app-config'
import type { LayoutInst } from 'naive-ui'

/**
 *
 * @returns 侧栏 scrollTo；调用时读取当前布局实例，未挂载时不操作。
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
