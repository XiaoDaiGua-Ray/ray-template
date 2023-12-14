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

/**
 *
 * 检测当前尺寸是否为平板或者更小
 * 默认主流平板尺寸为 768px
 *
 * @example
 * const { width, height, isTabletOrSmaller } = useDevice()
 *
 * isTabletOrSmaller.value => true // 当前尺寸为平板或者更小
 * isTabletOrSmaller.value => false // 当前尺寸为桌面或者更大
 */
export function useDevice() {
  const { width, height } = useWindowSize()
  const isTabletOrSmaller = ref(false)

  const update = () => {
    isTabletOrSmaller.value = width.value <= 768
  }

  watchEffectWithTarget(update)

  return {
    width,
    height,
    isTabletOrSmaller,
  }
}

export type UseDeviceReturnType = ReturnType<typeof useDevice>
