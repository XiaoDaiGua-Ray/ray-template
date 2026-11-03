## 描述

该包存放与模板深度绑定的组件：

- app：存放与模板数据绑定的组件
- provider：存放模板注入类组件

## 页面与 Provider

- `AppPageHeader` 统一页面眉题、主标题、说明与右侧操作区；页面正文保留各自布局，不在此封装业务内容。
- `AppShareLink` 默认使用紧凑入口，工作台通过 `variant="cards"` 显示具名链接卡片，保留登录页的空间约束。
- `AppAvatar` 从 signing Store 读取头像与名称；保留 Naive UI Avatar 相关 props。
- `AppNaiveGlobalProvider` 提供 Naive UI 上下文以及 `window.$message`、`$notification`、`$dialog`、`$loadingBar`。离散提示实例随 Provider 初始化与卸载，并实时同步主题和语言；只在 Provider 挂载期间调用这些对象。
- `AppWatermarkProvider` 为全局水印提供入口，显示与内容通过 `useWatermark` 调整。需要限制水印覆盖范围时，调整 Provider 的挂载位置。
- `AppRequestCancelerProvider` 在路由更新前取消旧请求；默认布局内容负责挂载。自定义内容插槽时需保留所需的请求取消行为。

组件介绍放在此类文档中，声明前不再保留大段说明；注释位置与格式遵循 [统一注释规范](../../docs/comment-style.md)。
