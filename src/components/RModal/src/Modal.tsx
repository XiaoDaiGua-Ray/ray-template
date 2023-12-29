/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-22
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NModal } from 'naive-ui'

import props from './props'
import { completeSize, uuid } from '@/utils'
import { useWindowSize } from '@vueuse/core'
import { setupDraggable } from './utils'

import type interact from 'interactjs'

export default defineComponent({
  name: 'RModal',
  props,
  setup(props) {
    const { height } = useWindowSize()
    const cssVars = computed(() => ({
      '--r-modal-width': completeSize(props.width ?? 600),
      '--r-modal-card-width': completeSize(props.cardWidth ?? 600),
      '--r-modal-dialog-width': completeSize(props.dialogWidth ?? 446),
    }))
    const uuidEl = uuid()
    let intractable: null | ReturnType<typeof interact>
    // 记录拖拽的位置
    const position = {
      x: 0,
      y: 0,
    }

    /**
     *
     * 获取当前是否为 card 风格并且为全屏
     */
    const isFullscreenCardType = () =>
      props.preset === 'card' && props.fullscreen

    const setupInteract = () => {
      const target = document.getElementById(uuidEl)

      if (target) {
        setupDraggable(target, props.preset, {
          scheduler: (event) => {
            const target = event.target

            position.x += event.dx
            position.y += event.dy

            target.style.transform = `translate(${position.x}px, ${position.y}px)`
          },
        }).then((res) => {
          intractable = res
        })
      }
    }

    watch(
      () => props.show,
      (ndata) => {
        if (
          ndata &&
          props.dad &&
          (props.preset === 'card' || props.preset === 'dialog')
        ) {
          nextTick(() => {
            setupInteract()

            const target = document.getElementById(uuidEl)

            if (props.memoryPosition && target) {
              target.style.transform = `translate(${position.x}px, ${position.y}px)`
            }
          })
        } else {
          intractable?.unset()

          intractable = null
        }
      },
    )

    return {
      cssVars,
      height,
      isFullscreenCardType,
      uuidEl,
    }
  },
  render() {
    const { isFullscreenCardType } = this
    const { $props, $slots, $attrs } = this
    const { preset, ...$otherProps } = $props
    const { cssVars, height, uuidEl } = this

    return (
      <NModal
        class={[
          'r-modal',
          isFullscreenCardType() ? 'r-modal__preset-card--fullscreen' : '',
        ]}
        style={[cssVars, isFullscreenCardType() ? `height: ${height}px` : '']}
        preset={preset}
        {...{
          id: uuidEl,
        }}
        {...$otherProps}
        {...$attrs}
      >
        {{ ...$slots }}
      </NModal>
    )
  },
})
