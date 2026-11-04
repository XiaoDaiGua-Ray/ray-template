import { onClickOutside, useEventListener } from '@vueuse/core'
import type {
  MaybeElement,
  MaybeElementRef,
  OnClickOutsideHandler,
  OnClickOutsideOptions,
} from '@vueuse/core'
import { nextTick, readonly, ref, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { BasicTarget } from './types'
import { effectDispose } from './vue/effect-dispose'

export interface UseContextmenuCoordinateOptions {
  /** 关闭菜单后执行的外部点击回调。 */
  clickOutside?: OnClickOutsideHandler
  /** 菜单挂载在目标之外时，可将弹层加入外部点击的忽略范围。 */
  ignore?: OnClickOutsideOptions['ignore']
}

/**
 *
 * @param target 绑定右键菜单的元素
 * @param options 外部点击回调和监听器配置
 *
 * @description
 * 右键时阻止原生菜单并读取视口坐标；作用域销毁时停止监听。
 *
 * @returns 只读坐标、菜单显隐状态和更新、停止方法。
 */
export const useContextmenuCoordinate = (
  target: BasicTarget,
  options?: MaybeRefOrGetter<
    boolean | (UseContextmenuCoordinateOptions & AddEventListenerOptions)
  >,
) => {
  const x = ref(0) // 鼠标 x 坐标
  const y = ref(0) // 鼠标 y 坐标
  const show = ref(false) // 是否显示右键菜单
  const getEventOptions = () => {
    const current = toValue(options)

    // 必须允许 preventDefault，才能阻止原生菜单和自定义菜单同时打开。
    return typeof current === 'boolean'
      ? { capture: current, passive: false }
      : { ...current, passive: false }
  }
  let stopped = false
  let generation = 0

  /**
   *
   * @param value 是否显示右键菜单
   *
   * @description
   * 更新右键菜单的显示状态。
   */
  const updateShow = (value: boolean) => {
    if (stopped && value) return

    if (!value) generation += 1

    show.value = value
  }

  /**
   *
   * @param evt 鼠标事件
   *
   * @description
   * 鼠标右键点击事件，并且阻止默认事件。
   * 设置坐标后激活右键菜单。
   */
  const bindContextMenuEvent = (evt: Event) => {
    evt.preventDefault()

    updateShow(false)
    const current = generation

    nextTick().then(() => {
      if (stopped || current !== generation) return

      const { clientX, clientY } = evt as MouseEvent

      x.value = clientX
      y.value = clientY

      updateShow(true)
    })
  }

  const cleanupOutside = onClickOutside(
    target as MaybeElementRef<MaybeElement>,
    (event) => {
      updateShow(false)
      const current = toValue(options)

      if (typeof current === 'object') current.clickOutside?.(event)
    },
    {
      ignore: () => {
        const current = toValue(options)

        return typeof current === 'object'
          ? (toValue(current.ignore) ?? [])
          : []
      },
    },
  )

  const cleanupContextmenu = useEventListener(
    target,
    'contextmenu',
    bindContextMenuEvent,
    getEventOptions,
  )

  const cleanupClick = useEventListener(target, 'click', () => {
    updateShow(false)
  })

  /**
   *
   * @description
   * 取消待显示的菜单并注销当前实例的所有监听。
   */
  const stop = () => {
    stopped = true
    updateShow(false)
    cleanupContextmenu()
    cleanupClick()
    cleanupOutside()
  }

  effectDispose(stop)

  return {
    stop,
    x: readonly(x),
    y: readonly(y),
    show: readonly(show),
    updateShow,
  }
}

export type UseContextmenuCoordinateReturnType = ReturnType<
  typeof useContextmenuCoordinate
>
