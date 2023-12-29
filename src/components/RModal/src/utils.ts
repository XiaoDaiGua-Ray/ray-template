import interact from 'interactjs'

import type { ModalProps } from 'naive-ui'
import type { AnyFC } from '@/types'

interface SetupDraggableOptions {
  scheduler?: AnyFC
}

/**
 *
 * @param bindModal modal 预设元素
 * @param preset 预设类型
 *
 * 根据预设模态框设置拖拽效果
 * 但是该效果有且仅有 card, dialog 有效
 *
 * 默认添加 30ms 延迟，避免诡异问题
 */
export const setupDraggable = (
  bindModal: HTMLElement,
  preset: ModalProps['preset'],
  options?: SetupDraggableOptions,
): Promise<ReturnType<typeof interact>> => {
  const { scheduler } = options ?? {}

  return new Promise((resolve) => {
    setTimeout(() => {
      const allowFromStr =
        preset === 'card' ? '.n-card-header__main' : '.n-dialog__title'

      if (bindModal) {
        const dad = interact(bindModal)
          .draggable({
            inertia: true,
            autoScroll: true,
            allowFrom: allowFromStr,
            modifiers: [
              interact.modifiers.restrictRect({
                restriction: 'parent',
                endOnly: true,
              }),
            ],
            listeners: {
              move: (event) => {
                scheduler?.(event)
              },
            },
          })
          .resizable(false)

        resolve(dad)
      }
    }, 30)
  })
}
