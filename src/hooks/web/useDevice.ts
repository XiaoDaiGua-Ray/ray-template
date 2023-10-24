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

export function useDevice() {
  const { width, height } = useWindowSize()
  const isTabletOrSmaller = ref(false)

  watchEffect(() => {
    isTabletOrSmaller.value = width.value <= 768
  })

  return {
    width,
    height,
    isTabletOrSmaller,
  }
}
