import { LAYOUT_CONTENT_REF } from '@/app-config'
import type { LayoutInst } from 'naive-ui'

/**
 *
 * @returns 内容区 scrollTo；调用时读取当前布局实例，未挂载时不操作。
 */
export const useContentScroll = () => {
  /**
   *
   * @param options 横向坐标或 Naive UI 滚动选项
   * @param y 数字坐标模式下的纵向坐标，默认 0
   *
   * @description
   * 事件触发时再读取内容区实例，支持 setup 中创建和布局重新挂载。
   */
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
