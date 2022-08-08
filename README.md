# Ray template

`模板按照个人习惯进行搭建, 可以根据个人喜好进行更改`

## 项目说明

项目采用 `Vue 3` `TypeScript` `TSX` `Vite` 进行开发, 已经集成了一些常用的开发库, 进行了一些 `Vite` 相关配置, 例如全局自动引入、`GIZ` 打包、按需引入打包、[reactivityTransform](https://vuejs.org/guide/extras/reactivity-transform.html)等, 解放你的双手. 国际化插件, 按照项目需求自己取舍. 引入了比较火的 `hook` 库 [@vueuse](https://vueuse.org/), 极大提高你的搬砖效率. `小提醒: 为了避免使用 @vueuse 时出现奇奇怪怪的错误(例如: useDraggable 在使用的时候, TSX 形式开发会失效), 建议采用 <script setup /> 形式进行开发`.

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

## 项目结构

```
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
  - element: dom 相关操作方法

- vite-plugin: 插件注册
```

### 祝大家搬砖愉快, 希望这个模板能帮你省很多时间
