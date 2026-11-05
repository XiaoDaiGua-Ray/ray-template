# SVG 图标

图标使用相对目录作为完整名称，不再依赖全局唯一的文件名：

```tsx
import { RIcon } from '@/components'
import type { IconName } from '@/icons'

const name: IconName = 'directional/resize_h'
<RIcon name={name} />
```

`RIcon.name`、路由 `meta.icon`、侧栏 Logo 和图标包装组件共享严格的 `IconName` 联合类型。输入 `name` 时可获得完整分包路径提示，裸名称与不存在的路径会被 TypeScript 拒绝。类型来自文件生成，并非 TypeScript 自行读取文件系统。

## 分包

| 目录 | 用途 |
| --- | --- |
| `action` | 搜索、刷新、关闭、全屏、设置、打印等操作 |
| `directional` | 箭头、方向、行首行尾与尺寸方向 |
| `navigation` | 页面和功能导航 |
| `logo` | 品牌及产品标识 |
| `status` | 错误、帮助等状态提示 |
| `system` | 语言、明暗主题与系统偏好 |

文件/目录使用小写字母、数字、下划线或连字符，首字符为字母；SVG 必须位于分包内。允许嵌套，例如 `business/orders/approved.svg` 对应 `business/orders/approved`。不同分包允许同名文件。

单色图标使用 `currentColor`，有意留白用 `none`。品牌保留原色，不保证 `color` 覆盖其所有颜色。避免包含内置脚本、事件处理器和外部资源。

常规按钮使用 `<RIcon name="action/search" />` 即可，默认盒子为 20 px。菜单等组件已经定义图标尺寸时使用 `size="1em"`；紧凑的关闭按钮、行内提示或品牌标识可显式设定尺寸。新通用 SVG 要在同尺寸下比对现有线性图标：正方形视图框、主体约占 85%，箭头或省略号可多留一点空间。使用 `currentColor` 着色，并在浅色与深色背景检查小尺寸下的线条和留白。

详见[来源与授权清单](../ICON-SOURCES.md)。旧版的导出 Excel、Office 和登录插画已退役；读取历史路由和菜单时会分别迁移到下载、表格和通用页面图标。

## 自动生成与注入

- 新增、修改、删除或移动 SVG 时，开发服务自动检查并同步 `packages/icons/src/manifest.ts`；增加或删除整个分包时自动重启开发服务。
- `pnpm dev`、`build`、`dev-build`、`report` 和 `check` 都先自动生成清单；直接调用 Vite 时也由插件在启动/构建阶段同步。`typecheck` 与 `icons:check` 继续保持只读。也可单独运行 `pnpm icons:generate`。将更新后的清单与 SVG 一起维护。生成文件由项目 Prettier 配置格式化，模板同时遵守 ESLint 的声明空行规则。
- `pnpm icons:check` 检查清单是否与目录一致，`pnpm typecheck` 和 `pnpm check` 会执行它。请修改生成脚本，不手工维护联合类型。
- 每个顶层分包输出独立带 hash 的 SVG 雪碧图。生成的分包地址由 Spritemap 插件转换为随 Vite base 的开发/生产路径，`RIcon` 根据 name 的包名选择地址，再引用包含完整路径的 symbol ID。
- `/svg-icons` 提供分包筛选和路径搜索。点击图标默认复制 TSX 用法，也可切换到 Vue 模板格式。

旧版本缓存里的裸 Logo 或菜单图标名在读取边界通过 `resolveIconName` 迁移；仅当文件名唯一时转换。新代码必须使用完整路径，不为裸名放宽组件类型。
