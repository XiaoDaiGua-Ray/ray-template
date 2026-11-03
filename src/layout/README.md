# 布局与自定义

`RLayout` 保留现有 Vue 3 + TSX 结构、路由权限、菜单转换和页面缓存。访问 `/layout-demo` 或顶部设置抽屉的“布局”页签可即时预览配置。

## 导航与内容

- `side`：完整侧边菜单。
- `top`：完整顶部导航，Naive UI 处理横向溢出与子菜单。
- `mixed`：顶部一级导航，侧栏显示当前一级菜单的可见子菜单；单页菜单不占侧栏空间。
- ≤768px 自动使用完整菜单抽屉，不覆盖已保存的桌面模式。抽屉选中菜单后自动收起。
- 侧栏与抽屉的 Logo 固定在菜单上方；滚动条从菜单区域开始。菜单设置中的原生滚动条开关只作用于菜单列表。
- 内容支持流式铺满或定宽居中、640–2560px 最大宽度、0–48px 间距，以及顶栏/页脚固定或随内容滚动。标签和版权显隐沿用原设置。
- 最大化内容区与页面、标签菜单共享 Pinia 状态，退出按钮和 Esc 可恢复。

交互借鉴 [Vben 的布局偏好设置](https://doc.vben.pro/en/guide/essentials/settings.html)，复用现有 Naive UI 组件，不引入第二套布局框架。

## 配置与扩展

```tsx
import { useSettingActions } from '@/store'

const { updateSettingState } = useSettingActions()
updateSettingState('layoutConfig', {
  mode: 'mixed',
  contentWidth: 'fixed',
  contentMaxWidth: 1200,
  contentPadding: 16,
})
```

配置属于 `setting` Store，沿用原有持久化 key；旧缓存自动补默认值并规范化范围，不清空用户偏好。`src/store/modules/setting/constant.ts` 管理默认值。恢复默认布局只重置 `layoutConfig`。

需要替换区域时使用具名插槽：

```tsx
<RLayout>
  {{
    header: () => <CustomHeader />,
    sidebar: () => <CustomSidebar />,
    tabs: () => <CustomTabs />,
    footer: () => <CustomFooter />,
    default: () => <CustomContent />,
  }}
</RLayout>
```

插槽替换遵循当前模式与显隐设置：顶部导航模式无 sidebar，关闭标签/版权后不渲染相应区域。自定义内容需要自行处理请求取消与路由内容；未替换时沿用默认 Provider 和路由缓存。

布局的内容滚动引用仍为 `LAYOUT_CONTENT_REF`，侧栏引用为 `LAYOUT_SIDER_REF`；`useContentScroll` / `useSiderScroll` 在执行时读取当前引用，支持模式切换与组件重新挂载。

## 样式归属

`index.scss` 负责布局外壳、内容滚动与最大化。顶部导航、菜单、标签栏和内容加载状态的样式随各自组件维护。设置抽屉与布局实验室共用 `LayoutSettings` 和 `LayoutSettings.scss`。方形选项卡片内的缩略图标出导航位置，卡片下方说明当前模式的菜单行为。卡片组为键盘焦点外框留出空间，选中状态由 `aria-pressed` 表示。
