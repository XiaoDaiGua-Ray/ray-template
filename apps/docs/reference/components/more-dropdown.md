# RMoreDropdown

包装 `NDropdown`，为行操作提供默认的更多图标。`options`、`trigger`、`placement`、`onSelect(key, option)`、受控显隐等沿用 Naive UI Dropdown。

| 属性       | 默认            | 说明                                  |
| ---------- | --------------- | ------------------------------------- |
| `icon`     | `'action/more'` | 类型为 `IconName`，使用完整分包路径。 |
| `iconSize` | `14`            | 默认触发图标大小。                    |
| `cursor`   | `'default'`     | 默认图标指针样式。                    |

`default` 插槽替换图标触发器。只有图标时建议用具有可访问名称的原生按钮或 `NButton`，方便键盘进入。列表行中根据业务需要阻止触发器的点击冒泡，避免同时触发行导航。

```tsx
import { RIcon, RMoreDropdown } from '@/components'
import { NButton } from 'naive-ui'

export const renderRowActions = (edit: () => void) => (
  <RMoreDropdown
    trigger="click"
    placement="bottom-end"
    options={[{ key: 'edit', label: '编辑' }]}
    onSelect={(key) => {
      if (key === 'edit') edit()
    }}
  >
    <NButton
      text
      aria-label="更多操作"
      onClick={(event) => event.stopPropagation()}
    >
      <RIcon name="action/more" />
    </NButton>
  </RMoreDropdown>
)
```

[组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RMoreDropdown/src/MoreDropdown.tsx) · [Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RMoreDropdown/src/props.ts)
