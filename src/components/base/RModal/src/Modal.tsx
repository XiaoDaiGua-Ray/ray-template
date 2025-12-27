import './index.scss'
import { completeSize, uuid } from '@/utils'
import { NModal } from 'naive-ui'
import type { ModalProps } from 'naive-ui'
import {
  CSS_VARS_KEYS,
  FULLSCREEN_CARD_TYPE_CLASS,
  R_MODAL_CLASS,
} from './constant'
import props from './props'

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
    // 当前是否为预设 card 类型并且设置了 fullscreen
    const isFullscreenCardType = computed(
      () => props.preset === 'card' && props.fullscreen,
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
