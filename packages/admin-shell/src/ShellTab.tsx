import './Tabs.scss'
import { RIcon } from '@ray-template/ui/icon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export const ShellTab = defineComponent({
  name: 'ShellTab',
  props: {
    label: { type: String, required: true },
    active: Boolean,
    closeLabel: { type: String, default: '' },
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
  setup(props) {
    return () => (
      <div
        class={['menu-tag__item', { 'menu-tag__item--active': props.active }]}
        onContextmenu={props.contextMenu}
      >
        <button
          type="button"
          class="menu-tag__tab"
          aria-current={props.active ? 'page' : void 0}
          title={props.label}
          onClick={props.select}
          onKeydown={(event) => {
            if (event.key === 'Delete' && props.close) {
              event.preventDefault()
              props.close(true)
            }
          }}
        >
          {props.label}
        </button>
        {props.close ? (
          <button
            type="button"
            class="menu-tag__close"
            aria-label={props.closeLabel}
            onClick={(event) => props.close?.(event.detail === 0)}
          >
            <RIcon name="action/close" size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    )
  },
})
