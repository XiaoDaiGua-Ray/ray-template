import './index.scss'

import { NModal } from 'naive-ui'

import props from './props'
import { completeSize, uuid } from '@/utils'
import { setupInteract } from './utils'
import {
  FULLSCREEN_CARD_TYPE_CLASS,
  R_MODAL_CLASS,
  CSS_VARS_KEYS,
} from './constant'

import type interact from 'interactjs'
import type { ModalProps } from 'naive-ui'

export default defineComponent({
  name: 'RModal',
  props,
  setup(props) {
    const cssVars = computed(() => ({
      [CSS_VARS_KEYS['width']]: completeSize(props.width ?? 600),
      [CSS_VARS_KEYS['cardWidth']]: completeSize(props.cardWidth ?? 600),
      [CSS_VARS_KEYS['dialogWidth']]: completeSize(props.dialogWidth ?? 446),
    }))
    const uuidEl = uuid()
    let intractable: null | ReturnType<typeof interact>
    // 记录拖拽的位置
    const position = {
      x: 0,
      y: 0,
    }
    // 当前是否为预设 card 类型并且设置了 fullscreen
    const isFullscreenCardType = computed(
      () => props.preset === 'card' && props.fullscreen,
    )

    watch(
      () => props.show,
      (ndata) => {
        if (
          ndata &&
          props.dad &&
          (props.preset === 'card' || props.preset === 'dialog')
        ) {
          nextTick(() => {
            const target = document.getElementById(uuidEl)

            if (target) {
              setupInteract(target, {
                preset: props.preset,
                x: position.x,
                y: position.y,
                dargCallback: (x, y) => {
                  position.x = x
                  position.y = y
                },
              }).then((res) => {
                intractable = res
              })
            }

            if (props.memo && target) {
              target.style.transform = `translate(${position.x}px, ${position.y}px)`
            }
          })
        } else {
          intractable?.unset()

          intractable = null
        }
      },
      {
        immediate: true,
      },
    )

    return {
      cssVars,
      isFullscreenCardType,
      uuidEl,
    }
  },
  render() {
    const { $props, $slots, $attrs } = this
    const { preset, ...$otherProps } = $props as ModalProps
    const { cssVars, uuidEl, isFullscreenCardType } = this

    return (
      <NModal
        class={[
          R_MODAL_CLASS,
          isFullscreenCardType ? FULLSCREEN_CARD_TYPE_CLASS : '',
        ]}
        style={[cssVars, isFullscreenCardType ? `height: 100vh` : '']}
        preset={preset}
        {...{
          id: uuidEl,
        }}
        {...$otherProps}
        {...$attrs}
      >
        {{
          ...$slots,
        }}
      </NModal>
    )
  },
})
