# Ray template

## 前言

> 模板按照个人习惯进行搭建, 可以根据个人喜好进行更改. 预设了一些组件库、国际化库的东西. 建议使用 `naive-ui` 作为组件库.

## 预览地址

[**`Ray Template`**](https://xiaodaigua-ray.github.io/#/)

## 项目说明

> 项目采用 `Vue 3` `TypeScript` `TSX` `Vite` 进行开发, 已经集成了一些常用的开发库, 进行了一些 `Vite` 相关配置, 例如全局自动引入、`GZ` 打包、按需引入打包、[reactivityTransform](https://vuejs.org/guide/extras/reactivity-transform.html)等, 解放你的双手. 国际化插件, 按照项目需求自己取舍. 引入了比较火的 `hook` 库 [@vueuse](https://vueuse.org/), 极大提高你的搬砖效率. `小提醒: 为了避免使用 @vueuse 时出现奇奇怪怪的错误(例如: useDraggable 在使用的时候, TSX 形式开发会失效), 建议采用 <script setup /> 形式进行开发`. 可以根据自己项目实际需求进行配置 `px` 与 'rem' 转换比例(使用 `postcss-pxtorem` 与 `autoprefixer` 实现).

## 启动项目

`yarn dev` / `npm run dev`

## 项目打包

`yarn build` / `npm run build`

## 使用开源库

- [pinia](https://pinia.vuejs.org/) `全局状态管理器`
- [@vueuse](https://vueuse.org/) `vue3 hooks`
- [vue-router](https://router.vuejs.org/zh/) `router`
- [axios](http://axios-js.com/zh-cn/docs/index.html) `ajax request`
- [vue-i18n](https://kazupon.github.io/vue-i18n/zh/introduction.html) `国际化`
- [scrollreveal.js](https://scrollrevealjs.org/) `滚动加载动画`
- [crypto-js](https://github.com/brix/crypto-js) `加密`
- [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) `svg组件化`
- [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md) `svg雪碧图`

## 组件说明

`RayScrollReveal` 基于 `ScrollReveal` 进行开发, 可以实现滚动加载动画

`RayTransitionComponent` 路由过渡动画组件, 可根据自己喜好更改 `src/styles/animate.scss` 文件过渡效果

## 项目结构

```
- locales: 国际化多语言入口(本项目采用 `json` 格式)

- assets: 项目静态资源入口
  - images: 项目图片资源

- component: 全局共用组件

- icons: 项目svg图标资源，需要配合 RayIcon 组件使用

- language: 国际化

- router: 路由表

- store: 全局状态管理入口
  - modules
    - setting: demo

- styles: 全局公共样式入口

- types: 全局 type

- utils: 工具包
  - cache: 缓存方法
  - crypto: 常用的加密方法
  - element: dom 相关操作方法
  - hook: 常用 hook 方法

- vite-plugin: 插件注册
```

## 如果你采用的 `naive-ui` 作为组件库, 可能需要它

```
# 如何在项目内使用提示组件
window.$dialog
window.$message
window.$loadingBar
window.$notification
```

### 祝大家搬砖愉快, 希望这个模板能帮你省很多时间
