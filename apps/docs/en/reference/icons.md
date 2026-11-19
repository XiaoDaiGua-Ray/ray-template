# SVG Icons {#svg-图标}

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

```tsx
import type { IconName } from '@ray-template/icons'
import { RIcon } from '@ray-template/ui/icon'

const name: IconName = 'directional/resize_h'

const renderIcon = () => <RIcon name={name} />
```

`RIcon.name` and route `meta.icon` use the same group-qualified names. For example, `packages/icons/src/business/orders/approved.svg` becomes `business/orders/approved`. Search and copy usage from the SVG Icons demo.

## Interactive example {#交互示例}

The icon library copies TSX by default, such as `<RIcon name="action/search" />`. Select **Vue template** and click an icon to copy `<r-icon name="action/search" />` for a Vue template that imports `RIcon`.

<AdminExample path="/svg-icons" title="Search icons and switch the copied format" />

::: details View example source
<<< @/../admin/src/views/demo/svg-icons/index.tsx
:::

## Add and generate icons {#添加和生成}

1. Choose an existing group such as `action`, `navigation`, or `system`, or create a business group. Start path segments with a letter and use lowercase letters, digits, underscores, or hyphens.
2. Use `currentColor` for monochrome icons and `none` for empty areas. Keep brand colors.
3. The dev server or `pnpm icons:generate` updates `packages/icons/src/manifest.ts`. Verify with `pnpm icons:check` and commit the manifest with the SVGs. Generate the union type from the files.

Production builds generate a separate hashed sprite per top-level group, loaded under the deployment base. Replace bare names in old source. Cached bare names are migrated only if the filename is unique.

[Icon workflow and group map](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/icons/src/A_README.md)

## RIcon API

`@/components` exports `RIcon`, `IconProps`, `iconProps`, `IconName`, and `IconPackage`. `@/icons` also exports the icon types.

| Prop               | Default          | Description                                                             |
| ------------------ | ---------------- | ----------------------------------------------------------------------- |
| `name`             | Required         | Full group-qualified path. The first segment selects the sprite.        |
| `size`             | `20`             | Base width and height. Numbers are pixels, and CSS sizes are supported. |
| `width` / `height` | `0` / `0`        | Override the base dimensions individually. `0` uses `size`.             |
| `color`            | `'currentColor'` | SVG fill. Brand icons with their own colors may retain them.            |
| `prefix`           | `'icon'`         | Symbol prefix, which must match generation.                             |
| `customClassName`  | None             | Extra class for the root.                                               |
| `depth`            | `1`              | Icon opacity level.                                                     |
| `cursor`           | `'inherit'`      | Inherits the parent control's cursor.                                   |
| `onClick(event)`   | None             | Accepts a callback or array.                                            |

The inner SVG is hidden from screen readers. For an action, wrap it in a button with an accessible name and preserve keyboard operation and focus.

[RIcon props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIcon/src/props.ts) · [Sprite reference implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIcon/src/Icon.tsx)

## Icon sources {#图标来源}

Shared icons come from the [IconPark outline collection on Iconfont](https://www.iconfont.cn/collections/detail?cid=51731). The [source inventory](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/icons/ICON-SOURCES.md) lists names and Iconfont IDs by use. Monochrome icons follow text color. Ray and other brand marks retain their original colors.

Prefer existing icon names. Three retired assets migrate when loading old route configurations.

- `action/export_excel` becomes `action/download`.
- `logo/office` becomes `navigation/table`.
- `illustration/login_bg` becomes `navigation/other`.

Use the new full names in new code.
