import interact from 'interactjs'

import type { ModalProps } from 'naive-ui'
import type { RModalProps } from './types'

interface SetupDraggableOptions {
  scheduler?: (event: Interact.DragEvent) => void
}

interface SetupInteractOptions {
  preset: ModalProps['preset']
  memo?: RModalProps['memo']
  x: number
  y: number
  dargCallback?: (x: number, y: number, event: Interact.DragEvent) => void
}

/**
 *
 * @param bindModal modal 预设元素
 * @param preset 预设类型
 *
 * @description
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

export const setupInteract = (
  target: HTMLElement | string,
  options: SetupInteractOptions,
): Promise<ReturnType<typeof interact>> => {
  const _target =
    typeof target === 'string'
      ? (document.querySelector(target) as HTMLElement)
      : target

  return new Promise((resolve, reject) => {
    if (_target) {
      _target.setAttribute('can-drag', 'true')

      const { preset, dargCallback } = options
      let { x, y } = options

      setupDraggable(_target, preset, {
        scheduler: (event) => {
          const target = event.target

          x += event.dx
          y += event.dy

          target.style.transform = `translate(${x}px, ${y}px)`

          dargCallback?.(x, y, event)
        },
      }).then((res) => {
        resolve(res)
      })
    } else {
      reject()
    }
  })
}
