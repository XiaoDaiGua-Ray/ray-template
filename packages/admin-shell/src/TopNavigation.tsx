import './TopNavigation.scss'
import { findMenuRoot, firstMenuLeaf } from '@ray-template/routing'
import type { AppMenuKey, AppMenuOption } from '@ray-template/routing'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'

export const ShellTopNavigation = defineComponent({
  name: 'ShellTopNavigation',
  props: {
    items: { type: Array as PropType<AppMenuOption[]>, required: true },
    active: { type: [String, Number] as PropType<AppMenuKey>, default: null },
    label: { type: String, required: true },
    grouped: Boolean,
    iconSize: { type: Number, default: 20 },
    select: {
      type: Function as PropType<(option: AppMenuOption) => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const mixed = computed(() => props.grouped)
    const options = computed(() =>
      mixed.value
        ? props.items
            .filter((option) => option.show !== false)
            .map((option) => ({ ...option, children: void 0 }))
        : props.items,
    )
    const selected = computed(() =>
      mixed.value
        ? findMenuRoot(props.items, String(props.active))?.fullPath
        : props.active,
    )
    const select = (key: string, option: AppMenuOption) => {
      const root = mixed.value
        ? props.items.find((item) => item.fullPath === key)
        : option
      const leaf = root && firstMenuLeaf(root)

      if (leaf) props.select(leaf)
    }

    return () => (
      <nav class="r-layout-top-navigation" aria-label={props.label}>
        {slots.logo?.()}
        <NMenu
          mode="horizontal"
          responsive
          iconSize={props.iconSize}
          collapsedIconSize={props.iconSize}
          keyField="fullPath"
          value={selected.value}
          options={options.value as unknown as MenuOption[]}
          onUpdateValue={(key, option) =>
            select(String(key), option as unknown as AppMenuOption)
          }
        />
      </nav>
    )
  },
})
