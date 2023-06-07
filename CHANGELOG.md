# CHANGE LOG

## 3.3.3

### Feats

- 新增五个计算方法（解决精度问题）
- 解决一些小问题

## 3.3.1

### Feats

- 新增 useAppTheme sass 方法

```ts
useAppTheme key 类型: 'dark' | 'light'
```

```scss
// 暗色主题
.demo--dark {
  @include useAppTheme('dark') {
    color: #ffffff;
  }
}
// 明亮主题
.demo--light {
  @include useAppTheme('light') {
    color: #000000;
  }
}
```

- 一些细节优化
- axios 拦截器与 axios instance 进行独立（现在不再 instance.ts 文件中编写拦截器相关逻辑），拦截器逻辑放在 inject 包中
- 一些 bug 修复

## 3.3.0

### 特征

- 取消 RootRoute 属性暴露全局
- 新增 Route Meta keepAlive 配置开启页面缓存（可以在 AppConfig APP_KEEP_ALIVE 中进行缓存的配置管理）
- 回退使用自动导入路由模块方式，具体使用方法查看 [路由配置](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/src/router/README.md)
- 新增 Route Meta order 配置，配置菜单顺序
- 新增 useVueRouter 方法，让你在 setup 环境之外使用 router hook
- 补充引入了一些 eslint 规则
- 支持更多 appConfig 配置

### 补充

- 后续该模板还会持续维护，会尽可能多的支持更多业务场景
- 最近破坏性更新很多，发布比较频繁，后续应该不会有这么大的破坏性更新。核心重点会放在模板整体的健壮性、可维护性上
- 未来希望模板拆分为一个高拓展性的工程，积木式管理项目，让项目模块之间尽可能的解耦。让模板有更好的拓展性，让你在使用时，可以根据自身业务需求进行拓展（当然，我希望你能以项目的基本维护原则延续）

## 3.2.3

### 特征

- 新增锁屏功能（值得注意的是，锁屏解锁后会刷新当前 RouterView 区域，因为在处于锁屏状态时，会自动销毁所有的操作页面。可以理解为是一个 v-if 操作行为）
- 新增 dayjs hook，支持国际化与切换
- 支持更多 appConfig 配置
- 调整 setupAppRoute 触发时机（现在会在 layout 渲染阶段触发）
- 补充了新的组件分包 AppComponents，存放该系统的一些组件（会与系统进行一些深度绑定，例如 AppAvatar 组件依赖系统数据）

### 补充

- 锁屏功能的设计并不理想，后期会进行破坏性更新。锁屏触发条件与管理方式目前并不理想，管理有点混乱
- 后期会考虑补充 keepAlive 功能。目前没有实现是因为该功能实现的话，需要将所有路由提升为顶层路由（这是 KeepAlive 组件限制），目前并未实现该功能。后期会在权衡后增加该功能，实现时会在 RayTransitionComponent 进行拓展补充

## 3.2.2

### 特征

- 移除 amfe-flexible 插件，改用为 postcss-px-to-viewport 作为适配插件
- 支持更多 appConfig 配置

## 3.2.1

### 特征

- 调整系统文件分包，现在结构更加合理、更加清晰
- 新增 src/appConfig 配置入口，配置系统（还在持续补充中...）
- vite 版本更新到 4.3.8

## 3.1.8

### Fixes

- 修复路由切换不能复位容器位置问题（让可视区域置顶）

### Feats

- 新增 useI18n hook 方法
- 手动补充 AppRouteRecordRaw、AppRouteMeta 类型
- 重新拆分 Layout 入口文件
- 重新指定组件暴露方法、属性
- 修改国际化管理方式，现在支持自动合并管理与结合 i18n-ally 使用。并且支持 unplugin-vue-i18n 构建，提高性能

## 3.1.7

### Fixes

- 修复默认获取容器可视区域高度问题
- 修复登陆页虚线高度问题

### Feats

- 修改 Menu 菜单过滤逻辑，现在如果权限不匹配或者设置了 hidden 属性，则会被过滤掉
- 移除 $activedColor 全局 sass 变量，使用 --ray-theme-primary-color 替代
- 新增路由菜单检索功能
- 移除 App.tsx 中同步主题方法，改为使用 cfg 配置并且使用 ejs 注入
- 移除 MenuTag 默认主题色，现在会以当前主题色为主色

## 3.1.6

### Fixes

- 修复移动端登陆页显示问题
- 改进了一些方法逻辑的问题
- 修改移动端自适应配置方案(现在使用 postcss-px-to-viewport)，默认不启用
- 修复 RayTable 实例方法暴露错误
- 修复 sideBarLogo.icon 为空时警告问题，现在未配置该属性则不会渲染图标
- 修复 RayTable 演示页面 action 方法失效问题

### Feats

- 新增加载动画
- 现在可以直接配置首屏加载动画一些信息(cfg.ts)
- 新增对于 ejs 支持
- 补充一些细节注释
- 新增 RayChart 组件 loading、loadingOptions 属性配置
- 新增反转色模式
- 修改 Menu 菜单过滤逻辑，现在如果权限不匹配或者设置了 hidden 属性，则会被过滤掉

## 3.1.5

### Fixes

- 配置 `tsconfig.json` 中 `ignoreDeprecations` 属性，消除 `ts5.0` 破坏性配置更新警告

### Feats

- 基于 `onlyoffice` 新增 `Office` 功能(待完成...)
- 重写 `AxiosInstance` 类型
- `src/types` 分包更加清晰
- 将主色调同步至 `body`，默认同步 `cfg.primaryColor` 值
- 登陆页一些修改(现在支持简单的响应式)
- 将一些设置型功能抽离为组件
- 调整同步主题色执行时机

## 3.1.4

### Fixes

- 修复主题色切换后，点击、鼠标滑入主题未被修改问题
- 修复 menu store 菜单切换可能会重复执行问题

### Feats

- 补充 MenuTag 标签页功能，现在支持丰富的关闭操作与右键菜单激活操作菜单功能
- 新增配置全局重定向地址配置（详情见：[cfg](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/cfg.ts)）
- 补充了一些不值一提的小东西

## 3.1.3

### Fixes

- 修复菜单栏、标签页栏 border 显示问题

### Feats

- RayTable 组件新增全屏、尺寸调整功能
- 新增 css 预处理全局注入辅助函数。详情看 [mixinCSS](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/cfg.ts)
- RayTable 组件部分提示文案修改
- body 新增当前主题色 class 标识(dark: ray-template--dark，light: ray-template--light)，便捷主题切换配置

## 3.1.2

### Fixes

- 修复 DatePicker 组件国际化部分失效问题

### Feats

- 修改 demo 页面展示
- 修改 RayCollapseGrid、RayTable 组件为默认不展示 border

## 3.1.1

### Fixes

- 修复国际化语言包模块合并处理不能正常合并问题
- 修复国际化切换时，面包屑、标签页不能正常切换

### Feats

- 新增面包屑
- 支持国际化语言包分包管理(但是，依旧是合并到一个文件中，所以需要注意 key 的管理)
- 新增国内预览地址
