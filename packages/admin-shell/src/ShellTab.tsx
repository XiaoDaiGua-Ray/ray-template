import './Tabs.scss'
import { NTag } from 'naive-ui'
import { defineComponent } from 'vue'
import type { PropType, VNode } from 'vue'

export const ShellTab = defineComponent({
  name: 'ShellTab',
  props: {
    label: { type: String, required: true },
    active: Boolean,
    round: Boolean,
    statusLabel: { type: String, default: '' },
    closeLabel: { type: String, default: '' },
    keyShortcuts: { type: String, default: void 0 },
    select: { type: Function as PropType<() => void>, required: true },
    close: {
      type: Function as PropType<(restoreFocus: boolean) => void>,
      default: void 0,
    },
    contextMenu: {
      type: Function as PropType<(event: MouseEvent) => void>,
      default: void 0,
    },
  },
  setup(props, { slots }) {
    const setNativeCloseLabel = ({ el }: VNode) => {
      if (!(el instanceof HTMLElement)) return

      el.querySelector('.n-tag__close')?.setAttribute(
        'aria-label',
        props.closeLabel || 'close',
      )
    }

    return () => (
      <NTag
        class={['menu-tag__item', { 'menu-tag__item--active': props.active }]}
        type={props.active ? 'primary' : 'default'}
        size="medium"
        round={props.round}
        closable={!!props.close}
        {...{
          onClick: props.select,
          onContextmenu: props.contextMenu,
          onVnodeMounted: setNativeCloseLabel,
          onVnodeUpdated: setNativeCloseLabel,
        }}
        onClose={(event) => props.close?.(event.detail === 0)}
      >
        {{
          icon: slots.prefix,
          default: () => (
            <button
              type="button"
              class="menu-tag__tab"
              aria-current={props.active ? 'page' : void 0}
              aria-label={
                props.statusLabel
                  ? `${props.label} · ${props.statusLabel}`
                  : void 0
              }
              aria-keyshortcuts={props.keyShortcuts}
              title={props.label}
              onKeydown={(event) => {
                if (event.key === 'Delete' && props.close) {
                  event.preventDefault()
                  props.close(true)
                }
              }}
            >
              {props.label}
            </button>
          ),
        }}
      </NTag>
    )
  },
})
