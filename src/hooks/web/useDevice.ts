import { useWindowSize } from '@vueuse/core'
import type { UseWindowSizeOptions } from '@vueuse/core'

type Callback = (
  isSmaller: boolean,
  size: { width: number; height: number },
) => void

export interface UseDeviceOptions extends UseWindowSizeOptions {
  /** 平板宽度上限，默认 768 像素。 */
  media?: number
  /** 窗口尺寸或断点结果更新后执行。 */
  observer?: Callback
}

/**
 *
 * @param options 窗口尺寸选项、断点与观察回调
 *
 * @description
 * 默认断点为 768 像素（含等于）。
 *
 * @returns 响应式窗口宽高和只读的断点判断。
 */
export function useDevice(options?: UseDeviceOptions) {
  const { width, height } = useWindowSize(options)
  const isTabletOrSmaller = computed(
    () => width.value <= (options?.media ?? 768),
  )

  if (options?.observer) {
    // 只跟踪尺寸与断点，避免观察回调读到的其他状态触发重复通知。
    watch(
      [isTabletOrSmaller, width, height],
      ([smaller, width, height]) => {
        options.observer?.(smaller, { width, height })
      },
      { immediate: true },
    )
  }

  return {
    width,
    height,
    isTabletOrSmaller,
  } as const
}

export type UseDeviceReturnType = ReturnType<typeof useDevice>
