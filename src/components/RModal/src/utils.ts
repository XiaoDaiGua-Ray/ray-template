import interact from 'interactjs'

import type { ModalProps } from 'naive-ui'

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
): Promise<ReturnType<typeof interact>> => {
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
                const target = event.target
                const x =
                  (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
                const y =
                  (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

                target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

                target.setAttribute('data-x', x)
                target.setAttribute('data-y', y)
              },
            },
          })
          .resizable(false)

        resolve(dad)
      }
    }, 30)
  })
}
