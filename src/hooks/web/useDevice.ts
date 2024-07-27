/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 检测当前尺寸是否为平板或者更小
 */

import { useWindowSize } from '@vueuse/core'
import { watchEffectWithTarget } from '@/utils'

import type { UseWindowSizeOptions } from '@vueuse/core'

type Callback = (
  isSmaller: boolean,
  size: { width: number; height: number },
) => void

export interface UseDeviceOptions extends UseWindowSizeOptions {
  /**
   *
   * @description
   * 自定义 isTabletOrSmaller 的判断尺寸。
   *
   * @default 768
   */
  media?: number
  observer?: Callback
}

/**
 *
 * @param options 配置项
 *
 * @description
 * 检测当前尺寸是否为平板或者更小
 * 默认主流平板尺寸为 768px
 *
 * @example
 * const { width, height, isTabletOrSmaller } = useDevice()
 *
 * isTabletOrSmaller.value => true // 当前尺寸为平板或者更小
 * isTabletOrSmaller.value => false // 当前尺寸为桌面或者更大
 */
export function useDevice(options?: UseDeviceOptions) {
  const { width, height } = useWindowSize(options)
  const isTabletOrSmaller = ref(false)
  const { observer } = options ?? {}

  const update = () => {
    const { media = 768 } = options ?? {}

    isTabletOrSmaller.value = width.value <= media

    observer?.(isTabletOrSmaller.value, {
      width: width.value,
      height: height.value,
    })
  }

  watchEffectWithTarget(update)

  return {
    width,
    height,
    isTabletOrSmaller: readonly(isTabletOrSmaller),
  }
}

export type UseDeviceReturnType = ReturnType<typeof useDevice>
