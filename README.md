# `Ray Template`

## 前言

> 该项目模板采用 `vue3.x` `vite3.2` `tsx` 进行开发，使用 `naive ui` 作为组件库。意在提供一个简洁、快速上手的模板。

## 版本说明

> 做了一些大的改动升级，让模板更加好用了一点，默认主题色也做了变更更好看了一点。啰嗦两句，好像也没啥其他的了...

## 功能

- 主题切换
- 错误页
- 动态切换主题、贴花的 `EChart` 图
- 带有拓展功能的表格
- 还有一些不值一提的小东西...

## 预览地址

[**<h3>`点击预览`</h3>**](https://xiaodaigua-ray.github.io/#/)

## 拉取依赖

```
# yarn

yarn
```

```
# npm

npm install
```

## 启动项目

```
# yarn

yarn dev
```

```
# npm

npm run dev
```

## 项目打包

```
# yarn

yarn build
```

```
# npm

npm run build
```

## 项目依赖

- [pinia](https://pinia.vuejs.org/) `全局状态管理器`
- [@vueuse](https://vueuse.org/) `vue3 hooks`
- [vue-router](https://router.vuejs.org/zh/) `router`
- [axios](http://axios-js.com/zh-cn/docs/index.html) `ajax request`
- [vue-i18n](https://kazupon.github.io/vue-i18n/zh/introduction.html) `国际化`
- [scrollreveal.js](https://scrollrevealjs.org/) `滚动加载动画`(暂时移除)
- [crypto-js](https://github.com/brix/crypto-js) `加密`
- [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) `svg组件化`
- [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md) `svg雪碧图`
- [echarts5](https://echarts.apache.org/examples/zh/index.html#chart-type-line) `可视化`
- [lodash-es](https://www.lodashjs.com/) `拓展方法`

## 基础组件

- `RayIcon` `svg icon`
- `RayChart` 基于 `echarts5.x` 封装可视化组件
- `RayTransitionComponent` 带过渡动画路由组件，效果与 `RouterView` 相同
- `RayTable` 基于 `Naive UI DataTable` 组件封装，实现了一些小功能
- `RayCollapseGrid` 基于 `Naive UI NGrid` 组件封装的可折叠操作栏

## 项目结构

```
- locales: 国际化多语言入口(本项目采用 json 格式)

- assets: 项目静态资源入口

- component: 全局共用组件

- icons: 项目svg图标资源，需要配合 RayIcon 组件使用

- language: 国际化

- layout: 全局页面结构入口

- router: 路由表

- store: 全局状态管理入口

- styles: 全局公共样式入口

- types: 全局 type

- utils: 工具包

- views: 页面入口

- vite-plugin: 插件注册
```

## 浏览器支持

> 仅支持现代浏览器，不支持 `IE`

## 最后，希望大家搬砖愉快
