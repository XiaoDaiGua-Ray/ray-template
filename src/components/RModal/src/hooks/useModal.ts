import { useModal as useNaiveModal } from 'naive-ui'
import { setupInteract } from '../utils'
import { queryElements, setStyle, completeSize, setClass } from '@/utils'
import { R_MODAL_CLASS, CSS_VARS_KEYS } from '../constant'

import type { RModalProps } from '../types'

interface UseModalCreateOptions extends Omit<RModalProps, 'memo'> {}

const useModal = () => {
  const { create: naiveCreate, destroyAll: naiveDestroyAll } = useNaiveModal()

  const create = (options: UseModalCreateOptions) => {
    const { preset, dad, fullscreen, width, cardWidth, dialogWidth } = options
    const modalReactive = naiveCreate(options)
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

      if (dad) {
        setupInteract(modalElement, {
          preset,
          x: 0,
          y: 0,
        })
      }

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
