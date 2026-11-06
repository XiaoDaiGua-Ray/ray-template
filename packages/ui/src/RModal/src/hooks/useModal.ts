import {
  completeSize,
  queryElements,
  setClass,
  setStyle,
} from '@ray-template/composables/element'
import { NScrollbar, useModal as useNaiveModal } from 'naive-ui'
import { h, nextTick } from 'vue'
import { CSS_VARS_KEYS, R_MODAL_CLASS } from '../constant'
import type { RModalProps } from '../types'

/**
 *
 * @description
 * 保留历史 RModal 命令式入口；新代码应使用 Naive UI 的 useModal 或声明式 RModal。
 *
 * @returns 创建弹窗与关闭全部弹窗的方法
 *
 * @deprecated
 *
 * @see https://www.naiveui.com/zh-CN/dark/components/modal#useModal-API
 */
const useModal = () => {
  const { create: naiveCreate, destroyAll: naiveDestroyAll } = useNaiveModal()

  /**
   *
   * @param options Naive UI 弹窗配置及模板尺寸、全屏配置
   *
   * @description
   * 由 Naive UI 创建并管理弹窗，DOM 就绪后补充模板尺寸样式；提前关闭时跳过补充。
   *
   * @returns Naive UI 弹窗响应式句柄
   */
  const create = (options: RModalProps) => {
    const { content, ...rest } = options
    let contentNode = content

    if (rest.preset === 'card' && rest.fullscreen) {
      contentNode = () =>
        h(
          NScrollbar,
          {
            themeOverrides: {
              color: 'rgba(0, 0, 0, 0)',
              colorHover: 'rgba(0, 0, 0, 0)',
            },
            trigger: 'hover',
            style: {
              width: 'auto',
              maxHeight:
                'calc(var(--html-height) - 29px - var(--n-padding-bottom) - var(--n-padding-bottom) - var(--n-padding-top))',
            },
          },
          {
            default: () =>
              typeof content === 'function' ? content() : content,
          },
        )
    }

    const { preset, fullscreen, width, cardWidth, dialogWidth } = options
    const modalReactive = naiveCreate({
      ...rest,
      content: contentNode,
    })
    const { key } = modalReactive
    const cssVars = {
      [CSS_VARS_KEYS['width']]: completeSize(width ?? 600),
      [CSS_VARS_KEYS['cardWidth']]: completeSize(cardWidth ?? 600),
      [CSS_VARS_KEYS['dialogWidth']]: completeSize(dialogWidth ?? 446),
    }

    nextTick(() => {
      const [modalElement] =
        queryElements<HTMLElement>(`[internalkey="${key}"]`) || []

      if (!modalElement) {
        return
      }

      // preset 为 card，fullscreen 为 true 时，最大化 modal
      if (fullscreen && preset === 'card') {
        setStyle(modalElement, {
          width: '100%',
          height: '100vh',
        })
      }

      setStyle(modalElement, cssVars)
      setClass(modalElement, R_MODAL_CLASS)
    })

    return modalReactive
  }

  return {
    create,
    destroyAll: naiveDestroyAll,
  }
}

export type UseModalReturn = ReturnType<typeof useModal>

export default useModal
