# Ray template

模板按照个人习惯进行原始框架、组件的引入与封装, 采用 `Vue 3` `TypeScript` `TSX` 进行开发

## 启动项目

`yarn dev` / `npm run dev`

## 项目打包

`yarn build` / `npm run build`

## 项目说明

## 使用开源库

- [pinia](https://pinia.vuejs.org/) `全局状态管理器`
- [@vueuse](https://vueuse.org/) `vue3 hooks`
- [vue-router](https://router.vuejs.org/zh/) `router`
- [axios](http://axios-js.com/zh-cn/docs/index.html) `ajax request`
- [vue-i18n](https://kazupon.github.io/vue-i18n/zh/introduction.html) `国际化`

## 项目结构

```
- assets: 项目静态资源入口
  - images: 项目图片资源

- `component`: 全局共用组件

- `icons`: 项目svg图标资源，需要配合 `RayIcon` 组件使用

- `language`: 国际化

- `router`: 路由表

- store: `pinia` 全局状态管理入口
  - modules
    - setting: demo

- styles: 全局公共样式入口

- types: 全局 `type`

- utils: 工具包
  - `cache`: 缓存方法
  - `element`: `dom` 相关操作方法

- vite-plugin: 插件注册
```
