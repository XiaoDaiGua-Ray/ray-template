- 类型

```ts
interface RouteMeta {
  i18nKey: string
  icon?: string
  windowOpen?: string
  role?: string[]
  hidden?: boolean
  noLocalTitle?: string | number
  ignoreAutoResetScroll?: boolean
}
```

- 说明

```
i18nKey: i18n 国际化 key, 会优先使用该字段
icon: icon 图标, 用于 Menu 菜单(依赖 RayIcon 组件实现)
windowOpen: 超链接打开（新开窗口打开）
role: 权限表
hidden: 是否显示
noLocalTitle: 不使用国际化渲染 Menu Titile
ignoreAutoResetScroll: 该页面内容区域自动初始化滚动条位置
```
