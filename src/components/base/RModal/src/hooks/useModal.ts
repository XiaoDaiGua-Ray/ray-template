import { useModal as useNaiveModal, NScrollbar } from 'naive-ui'
import { setupInteract } from '../utils'
import { queryElements, setStyle, completeSize, setClass } from '@/utils'
import { R_MODAL_CLASS, CSS_VARS_KEYS } from '../constant'

import type { RModalProps } from '../types'

interface UseModalCreateOptions extends Omit<RModalProps, 'memo'> {}

const useModal = () => {
  const { create: naiveCreate, destroyAll: naiveDestroyAll } = useNaiveModal()

  const create = (options: UseModalCreateOptions) => {
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
            trigger: 'none',
            style: {
              width: 'auto',
              height:
                'calc(100vh - 29px - var(--n-padding-bottom) - var(--n-padding-bottom) - var(--n-padding-top))',
            },
          },
          {
            default: () =>
              typeof content === 'function' ? content() : content,
          },
        )
    }

    const { preset, dad, fullscreen, width, cardWidth, dialogWidth } = options
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

      // 是否启用拖拽
      if (dad) {
        setupInteract(modalElement, {
          preset,
          x: 0,
          y: 0,
        })
      }

      // preset 为 card，fullscreen 为 true 时，最大化 modal
      if (fullscreen && preset === 'card') {
        const cardContentElement =
          modalElement.querySelector<HTMLElement>('.n-card__content')

        if (cardContentElement) {
          setStyle(cardContentElement, {
            maxHeight: `calc(100vh - 9px - var(--n-padding-bottom) - var(--n-padding-bottom) - var(--n-padding-top))`,
            overflowY: 'hidden',
            padding: '0',
          })
        }

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
