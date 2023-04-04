# CHANGE LOG

## 3.1.6

### Fixes

- 修复移动端登陆页显示问题
- 改进了一些方法逻辑的问题
- 修改移动端自适应配置方案(现在使用 postcss-px-to-viewport)，默认不启用

### Feats

- 新增加载动画
- 新增配置入口(cfg.ts)，现在可以直接配置首屏加载动画一些信息

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
