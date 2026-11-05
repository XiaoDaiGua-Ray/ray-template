# SVG 图标

<script setup>
import AdminExample from '../examples/AdminExample.vue'
</script>

```tsx
import type { IconName } from '@ray-template/icons'
import { RIcon } from '@ray-template/ui/icon'

const name: IconName = 'directional/resize_h'

const renderIcon = () => <RIcon name={name} />
```

`RIcon.name` 和路由 `meta.icon` 使用同一套完整分包名。将 SVG 加入 `packages/icons/src/<分包>`，例如 `packages/icons/src/business/orders/approved.svg` 对应 `business/orders/approved`。可在演示的 SVG 图标页面查找并复制用法。

## 交互示例

<AdminExample path="/svg-icons" title="搜索图标和复制名称" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/svg-icons/index.tsx
:::

## 添加和生成

1. 选择现有分包（如 `action`、`navigation`、`system`），或按业务新建分包。路径段使用小写字母、数字、下划线或连字符，且以字母开头。
2. 单色图标用 `currentColor`，留白用 `none`。品牌保留原色。
3. 开发服务或 `pnpm icons:generate` 更新 `packages/icons/src/manifest.ts`；检查 `pnpm icons:check`，与 SVG 一起提交。不要手改联合类型。

生产时每个顶层分包生成独立、带 hash 的雪碧图，资源随部署 base 加载。迁移时直接改旧代码的裸名称；旧缓存仅当文件名唯一时自动转换。

[图标流程与分包表](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/icons/src/A_README.md)

## RIcon API

`RIcon`、`IconProps`、`iconProps`、`IconName` 和 `IconPackage` 从 `@/components` 导出。也可从 `@/icons` 导入图标类型。

| 属性               | 默认             | 说明                                     |
| ------------------ | ---------------- | ---------------------------------------- |
| `name`             | 必填             | 完整的分包路径，首段用于选择雪碧图。     |
| `size`             | `20`             | 基础宽高，数字按像素，也可传 CSS 尺寸。  |
| `width` / `height` | `0` / `0`        | 分别覆盖基础尺寸，`0` 回退到 `size`。    |
| `color`            | `'currentColor'` | SVG 填充色；带原色的品牌不会全部被覆盖。 |
| `prefix`           | `'icon'`         | symbol 前缀，须与生成配置一致。          |
| `customClassName`  | 无               | 根元素的额外类名。                       |
| `depth`            | `1`              | 图标透明层级。                           |
| `cursor`           | `'inherit'`      | 默认继承所在控件的指针样式。             |
| `onClick(event)`   | 无               | 支持函数或回调数组。                     |

图标内部 SVG 对读屏隐藏。如果用图标触发操作，把它放进具有可访问名称的按钮内，保留键盘操作和焦点。

[RIcon Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIcon/src/props.ts) · [雪碧图引用实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIcon/src/Icon.tsx)

## 图标来源

通用图标选自 [Iconfont 的 IconPark 线性合辑](https://www.iconfont.cn/collections/detail?cid=51731)。[来源清单](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/icons/ICON-SOURCES.md)按用途列出包内名称和对应的 Iconfont ID。单色图标跟随文本颜色；Ray 和其他品牌标识保留各自原色。

已有图标名优先保留。三个退役资源的旧路由配置会在读取时迁移：`action/export_excel` → `action/download`、`logo/office` → `navigation/table`、`illustration/login_bg` → `navigation/other`。新代码直接使用新的完整名称。
