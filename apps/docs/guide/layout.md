# 应用布局与状态

<script setup>
import { withBase } from 'vitepress'
</script>

打开「布局实验室」或顶部设置抽屉里的「布局」页签，切换导航和工作区。桌面支持侧边 `side`、顶部 `top`、混合 `mixed`、右侧 `right` 和通栏分组 `split` 导航；混合模式把一级导航放在顶部，侧栏只显示当前分组的子菜单。宽度不超过 768px 时改用抽屉，保留原桌面偏好。

## 在线布局实验

在预览中切换导航方向、固定顶栏或内容宽度。预览使用 Ray Admin 的布局与设置组件，菜单和状态只在当前示例里生效。

<iframe :src="withBase('/playground/shell.html')" title="Ray Admin 布局交互示例" loading="lazy" style="width: 100%; height: 650px; border: 1px solid var(--vp-c-divider); border-radius: 12px;" />

::: details 查看示例源码
<<< @/examples/ShellDemo.vue
:::

## 配置工作区

```ts
import { useSettingActions } from '@/store'

const { updateSettingState } = useSettingActions()

updateSettingState('layoutConfig', {
  mode: 'mixed',
  contentWidth: 'fixed',
  contentMaxWidth: 1200,
  contentPadding: 16,
})
```

最大宽度范围是 640–2560px，间距为 0–48px。顶栏和页脚可固定或随内容滚动。旧设置补齐默认值，布局恢复默认只重置 `layoutConfig`。

## 菜单图标

展开侧栏、移动端抽屉和顶部导航默认使用 20 px 的图标；折叠侧栏默认 22 px，方便只凭图形辨认菜单。线性图标跟随菜单状态和明暗主题变色。可在「偏好设置 → 菜单」调整「图标尺寸」与「折叠图标尺寸」，修改即时生效。

## 替换布局区域

`RLayout` 提供 `header`、`sidebar`、`tabs`、`footer` 和 `default` 插槽。模式和显隐开关仍生效，例如顶部导航模式不会渲染侧栏。替换 `default` 内容时，需要自行接入所需的路由缓存和请求取消。

## 状态放在哪里

| 状态                             | 入口                                      | 刷新后的行为                   |
| -------------------------------- | ----------------------------------------- | ------------------------------ |
| 加载、移动抽屉、内容最大化、重载 | `useRuntimeGetters` / `useRuntimeActions` | 运行态，不持久化               |
| 布局、主题、语言等偏好           | `useSettingGetters` / `useSettingActions` | 沿用设置缓存；旧值补默认配置   |
| 锁屏                             | 锁屏 Store                                | 保留历史布尔值格式和跨标签同步 |

新增共享状态按职责放到 `apps/admin/src/store/modules`，对外用 Store hooks。持久化使用 `pick` / `omit` 选择字段；检查历史 key 和序列化格式再变更。

[布局说明与插槽](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/layout/README.md) · [状态实现与持久化](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/README.md)

更细的状态字段与更新动作见 [Setting Store](../reference/store/setting)、[Runtime Store](../reference/store/runtime) 和 [布局 Hooks](../reference/hooks/layout)。

## 最近访问和收藏

桌面搜索支持 Ctrl/Command + K。输入页面名称查找，点击星标收藏；空关键词时显示收藏与最近访问，方向键、回车和 Tab 可操作。记录按会话用户 id 隔离，刷新后恢复；清空记录保留收藏。缓存只存菜单路径，展示时重新依据当前菜单和权限筛选，语言切换沿用当前翻译。窄屏继续使用导航抽屉。

内容页需要撑满工作区时，先复用布局的 `--layout-content-height`、`RTablePro autoHeight` 和 `--r-table-height`，以及 Naive UI 的 `NCard contentScrollable` / `NScrollbar`。父容器提供确定高度，Flex/Grid 子项设置 `min-block-size: 0` 后再承载内部滚动；单纯填充与滚动无需新增通用组件。用户管理页展示了左右独立滚动与窄屏上下排布。
