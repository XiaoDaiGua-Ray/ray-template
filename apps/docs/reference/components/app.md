# 应用组件与 Provider

这些组件按文件默认导入，例如 `import AppPageHeader from '@/app-components/app/AppPageHeader'`。它们依赖应用 Store、路由或 DOM，按默认 [App 挂载顺序](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/App.tsx)集成。

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

## 后台上下文示例

这个预览运行后台的工作台和布局。在侧栏进入「模板 Hooks」，可以切换主题、水印、布局加载和菜单状态。版本提示、请求取消等 Provider 属于应用初始化流程，接入顺序见下表。

<AdminExample path="/dashboard" title="后台工作台、布局与 Provider" layout />

::: details 查看预览入口与工作台源码
<<< @/../admin/src/documentation-example.tsx
<<< @/../admin/src/views/dashboard/index.tsx
:::

## 页面组件

| 组件            | 配置和注意事项                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AppPageHeader` | `title` 必填，`description` 默认空，`eyebrow` 默认 `RAY TEMPLATE`。默认插槽是右侧操作区，页面内容放在组件之外。                                                                |
| `AppShareLink`  | `variant: 'compact' \| 'cards'`，默认 `compact`，从 dashboard 语言包读文案。链接由组件内配置，不接收任意链接列表。                                                             |
| `AppAvatar`     | 从 Signing Store 读头像与名字。`avatarSize`、`spaceSize` 默认 `medium`，`vertical` 默认 `false`；头像使用圆形、cover，空头像用名称首字。`src` 和 `size` 会被内部读取的值覆盖。 |
| `AppGlobalSpin` | 接收 NSpin 属性与插槽。显隐以 Runtime Store 的 `globalSpinning` 为准，传入 `show` 会被覆盖；和布局内容区 Spin 独立。                                                           |
| `AppLockScreen` | 由 `setting.lockScreenSwitch` 控制锁屏设置弹窗，不允许点遮罩或 Esc 关闭。锁定后由布局读取 Lock Screen Store 呈现解锁界面。                                                     |

```tsx
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { NButton } from 'naive-ui'

export const renderOrdersHeader = (create: () => void) => (
  <AppPageHeader eyebrow="库存" title="订单" description="查看和维护销售订单">
    <NButton type="primary" onClick={create}>
      新建订单
    </NButton>
  </AppPageHeader>
)
```

## Provider

| Provider                     | 职责与调用时机                                                                                                                                                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppNaiveGlobalProvider`     | 包裹默认插槽并同步明暗、主题覆盖、UI locale 和日期 locale。提供 Message、Dialog、Modal、Notification、LoadingBar 等上下文，并建立 `window.$message`、`$dialog`、`$notification`、`$loadingBar`。离散 API 在 Provider 初始化后可用，卸载时释放；不要在模块顶层提前调用。 |
| `AppStyleProvider`           | 同步 HTML 明暗类、CSS 主色和窗口尺寸变量，结束首屏加载动画。应用主题应通过设置方法更新。                                                                                                                                                                                |
| `AppVersionProvider`         | 启动时比较构建版本与本地版本。第一次写入缓存，变化时提示，确认会走退出并刷新；取消关闭提示。                                                                                                                                                                            |
| `AppWatermarkProvider`       | 按设置渲染全屏 Naive UI 水印；独立页面如需局部水印可自行在目标区域使用 `NWatermark`。                                                                                                                                                                                   |
| `AppRequestCancelerProvider` | 默认布局内容的路由更新钩子会取消模板管理的请求。替换内容插槽时，根据实际导航方式保留取消行为。                                                                                                                                                                          |

[应用组件说明](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/app-components/README.md) · [布局配置](../../guide/layout) · [Store](../store) · [请求取消](../../guide/requests)
