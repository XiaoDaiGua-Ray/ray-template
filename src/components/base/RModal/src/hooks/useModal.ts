import { useModal as useNaiveModal, NScrollbar } from 'naive-ui'
import { queryElements, setStyle, completeSize, setClass } from '@/utils'
import { R_MODAL_CLASS, CSS_VARS_KEYS } from '../constant'

import type { RModalProps } from '../types'

/**
 *
 * @deprecated
 *
 * @see https://www.naiveui.com/zh-CN/dark/components/modal#useModal-API
 *
 * @description
 * 请使用官方的 `useModal` 方法。
 */
const useModal = () => {
  const { create: naiveCreate, destroyAll: naiveDestroyAll } = useNaiveModal()

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
