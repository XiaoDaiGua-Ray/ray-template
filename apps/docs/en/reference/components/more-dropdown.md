# RMoreDropdown

<script setup>
import MoreDropdownDemo from '../../../examples/MoreDropdownDemo.vue'
</script>

Wraps `NDropdown` with a default more-actions icon for row actions. `options`, `trigger`, `placement`, `onSelect(key, option)`, and controlled visibility follow Naive UI Dropdown.

## Interactive example {#交互示例}

<ClientOnly>
  <MoreDropdownDemo />
</ClientOnly>

::: details View example source
<<< @/examples/MoreDropdownDemo.vue
:::

| Prop           | Default                                  | Description                                     |
| -------------- | ---------------------------------------- | ----------------------------------------------- |
| `icon`         | `'action/more'`                          | `IconName` using the full group-qualified path. |
| `iconSize`     | RIcon default                            | Trigger icon size. Omission uses 20 px.         |
| `cursor`       | `'inherit'`                              | Inherits the parent control's pointer style.    |
| `triggerLabel` | Injected translation or `'More actions'` | Accessible name of the default icon button.     |

The default trigger is a keyboard-focusable icon button. `placement` defaults to `'bottom-start'` and can be overridden. The `default` slot replaces the entire trigger. Give a custom native button or `NButton` an accessible name. Stop click propagation as needed in a row so opening the menu does not also navigate.

```tsx
import { RIcon, RMoreDropdown } from '@/components'
import { NButton } from 'naive-ui'

export const renderRowActions = (edit: () => void) => (
  <RMoreDropdown
    trigger="click"
    placement="bottom-end"
    options={[{ key: 'edit', label: 'Edit' }]}
    onSelect={(key) => {
      if (key === 'edit') edit()
    }}
  >
    <NButton
      text
      aria-label="More actions"
      onClick={(event) => event.stopPropagation()}
    >
      <RIcon name="action/more" />
    </NButton>
  </RMoreDropdown>
)
```

[Component implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RMoreDropdown/src/MoreDropdown.tsx) · [Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RMoreDropdown/src/props.ts)
