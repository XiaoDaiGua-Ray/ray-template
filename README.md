# `Ray Template`

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

## 感谢

> 感谢 <https://me.yka.moe/> 对于本人的支持。

## 预览地址

- [点击预览](https://xiaodaigua-ray.github.io/ray-template/#/)
- [点击预览(加速地址)](https://ray-template.yunkuangao.com/#/)

## 文档地址

- [文档](https://xiaodaigua-ray.github.io/ray-template-doc/)
- [文档(加速地址)](https://ray-template.yunkuangao.com/ray-template-doc/)

## 更新日志

- [日志](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/CHANGELOG.md)

## 常见问题

- [常见问题](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/COMMONPROBLEM.md)

## 功能

- 主题切换
- 任意深度页面缓存
- 系统配置化
- 锁屏
- 自动化路由
- 带有拓展功能的表格
- 封装 `axios` 自动取消重复请求，暴露拦截器注册器
- 全局菜单搜索
- 动态菜单（多级菜单）
- 主题色切换
- 错误页
- 面包屑
- 标签页
- 国际化（允许按模块管理语言包）
- 权限路由
- 动态切换主题、贴花的 `EChart` 图
- 最佳构建体验
- 体积分析
- 还有一些不值一提的小东西...

## 未来

> 根据个人时间空余情况，会不定时对该模板进行更新和迭代。希望将该工具的功能不断补全（虽然现在已经是足够日常开发和使用），将该模板打造为一个更加健全的中后台模板。如果你有好的想法和建议，可以直接联系我或者直接提 `issues` 即可。

## 前言

> 该项目模板采用 `vue3.x` `vite4.x` `pinia` `tsx` 进行开发。
> 使用 `naive ui` 作为组件库。
> 预设了最佳构建体验的配置与常用搬砖工具。意在提供一个简洁、快速上手的模板。
> 该模板不支持移动端设备。

## 提示

> 项目默认启用严格模式 `eslint`，但是由于 `vite-plugin-eslint` 插件优先级最高，所以如果出现自动导入类型错误提示，请优先解决其他问题。
> 建议开启 `vscode` 保存自动修复功能。

## 版本说明

> 做了一些大的改动升级，让模板更加好用了一点，默认主题色也做了变更更好看了一点。啰嗦两句，好像也没啥其他的了...

## 项目安装

```sh
# github
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git

# 如果你的下载速度很慢，可以切换到下面的代理地址
git clone https://gh.yka.moe/https://github.com/XiaoDaiGua-Ray/ray-template.git
```

## 拉取依赖

```sh
# yarn

yarn
```

```sh
# npm

npm install
```

## 启动项目

```sh
# yarn

yarn dev
```

```sh
# npm

npm run dev
```

## 项目打包

```sh
# yarn

yarn build
```

```sh
# npm

npm run build
```

## 预览项目

```sh
# yarn

yarn preview
```

```sh
# npm

npm run preview
```

## 体积分析

```sh
# yarn

yarn report
```

```sh
# npm

npm run report
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
- 还有一些后续补充的，懒得写了。。。自己看项目依赖页面

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

## 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://heartofyun.com"><img src="https://avatars.githubusercontent.com/u/40163747?v=4?s=100" width="100px;" alt="Cloud"/><br /><sub><b>Cloud</b></sub></a><br /><a href="#tool-yunkuangao" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
