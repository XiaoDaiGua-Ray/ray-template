import { LAYOUT_CONTENT_REF } from '@/app-config'
import type { LayoutInst } from 'naive-ui'

/**
 *
 * @returns 内容区 scrollTo；调用时读取当前布局实例，未挂载时不操作。
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
