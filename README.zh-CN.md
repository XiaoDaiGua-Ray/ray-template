<div align="center">
  <a href="https://github.com/XiaoDaiGua-Ray/ray-template">
    <img
      alt="Ray Template"
      width="200"
      height="200"
      src="https://avatars.githubusercontent.com/u/51957438?v=4"
    />
  </a>
  <br />
  <br />
  <a href="https://nodejs.org/en/about/previous-releases"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
  <a href="https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/LICENSE"
    ><img
      src="https://img.shields.io/github/license/XiaoDaiGua-Ray/ray-template"
      alt="LICENSE"
  /></a>
  <a href="#badge"><img src="https://img.shields.io/github/languages/top/XiaoDaiGua-Ray/ray-template" alt="language"></a>
  <a href="https://www.npmjs.com/package/ray-template"><img src="https://img.shields.io/npm/v/ray-template" alt="npm package"></a>
</div>

<div align="center">

# Ray Template

简体中文 | [English](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/README.md)

一个 `完全免费`、`高效`、`特性完整` 并且基于 Vite 8、TypeScript、Pinia 和 Vue 3的中后台模板。

</div>

## 🌻 简介

`Ray Template`采用前沿前端技术，摒弃繁杂与臃肿，采用模块化设计，解耦数据、方法和视图，专注业务开发。提供丰富配置和丰富的模板 `Hooks`，支持个性化定制，满足你的项目需求。

## ✨ 特性

- `全新技术栈：`使用 Vue 3 + TSX、Vite 8 / Rolldown、Pinia 4、Vue Router 5 与 Naive UI
- `主题：`可配置的主题
- `国际化：`内置完善的国际化方案
- `权限：`内置完善的动态路由权限生成方案
- `组件：`二次封装了多个常用的组件
- `工具包：`常用的工具函数封装
- `缓存：`任意深度页面缓存
- `模块化设计：`解耦管理的数据、方法、视图，放心二次开发
- `配置化：`支持丰富的配置项
- `代码风格：`内置 prettier, eslint 等代码风格工具
- `多端适配：`支持 pc, phone, pad
- `文档：`完善的文档
- `Mock 数据：`内置 Mock 数据方案
- `Axios 请求：`采用插件式设计二次封装 axios 库拦截器，让拦截器更加灵活
- `SVG：`内置 svg icon 解决方案
- `Hooks：`基于模板特性封装的 hooks 让你更加方便的使用模板一些功能
- `TypeScript：`提供完整的类型
- `Vitest：`内置 vitest 测试方案

## 👀 预览地址

- [点击预览](https://xiaodaigua-ray.github.io/ray-template/#/)

## 📌 文档地址

- [文档](https://xiaodaigua-ray.github.io/ray-template-doc/)

## 🔋 更新日志

- [更新日志](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/CHANGELOG.md)

## 🪴 准备

- [Node](https://nodejs.org/) 和 [git](https://git-scm.com/) - 项目开发环境
- [Vite](https://vite.dev/) - 熟悉 vite 特性
- [Vue3](https://vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉 TypeScript 基本语法
- [ES6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Hooks-Plus](https://inhiblabcore.github.io/docs/hooks/) - 熟悉 vue-hooks-plus useRequest 方法的基本使用
- [Vue-Router-Next](https://router.vuejs.org/) - 熟悉 vue-router4.x 基本使用
- [Naive-UI](https://www.naiveui.com) - naive ui 基本使用
- [Faker](https://fakerjs.dev/) - 本地化示例数据，配合 vite-plugin-mock-dev-server 提供 Mock 接口
- [Pinia](https://pinia.vuejs.org/zh/introduction.html) - 状态管理器 pinia 使用
- [TSX](https://github.com/vuejs/babel-plugin-jsx/blob/main/packages/babel-plugin-jsx/README-zh_CN.md) - tsx 基本语法
- [Vitest](https://cn.vitest.dev/guide/) - vitest 基本使用

## 工具链与 AI 辅助开发

使用 Node.js **26.13.0 LTS** 和 pnpm **12.16.1**，版本由 `.nvmrc`、`package.json` 与 `pnpm-lock.yaml` 固定。保留的直接依赖均使用当前稳定版；TypeScript 使用最新兼容版 **6.0.3**，因为 Vue 类型检查器与 ESLint 解析器尚未完整支持 TypeScript 7。详见 [升级记录与验证](docs/toolchain-upgrade.md)。

下面以 nvm 为例；使用 fnm 时，将前两行替换为 `fnm install && fnm use`。

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm env:check
pnpm check
```

| 命令                              | 用途与产物                                      |
| --------------------------------- | ----------------------------------------------- |
| `pnpm dev`                        | 开发服务：`http://127.0.0.1:9527/ray-template/` |
| `pnpm typecheck`                  | 检查应用、测试、构建配置类型                    |
| `pnpm lint` / `pnpm format:check` | 只读代码规范 / 格式检查                         |
| `pnpm lint:fix` / `pnpm format`   | 显式修复代码规范 / 格式                         |
| `pnpm test:run`                   | 单次执行测试；`pnpm test` 为监听模式            |
| `pnpm build`                      | 类型检查并生成 `dist/production`                |
| `pnpm dev-build`                  | 生成带 sourcemap 的 `dist/development`          |
| `pnpm preview`                    | 本地预览生产产物                                |
| `pnpm report`                     | 静态体积报告，不自动打开浏览器                  |
| `pnpm check`                      | 依次完成类型、lint、格式、单元测试和生产构建    |

检查失败时命令返回非零退出码。局域网调试按需执行 `pnpm dev --host 0.0.0.0`；部署子路径、CDN、代理和别名在 `vite.custom.config.ts` 中配置。

AI 助手统一读取 [AGENTS.md](AGENTS.md)、[架构地图](docs/architecture.md) 和 [开发指南](docs/ai-development.md)。Codex、Cursor、Copilot、Claude 的入口指向同一套工程事实与验收标准；当前无需模型 API key，也未增加产品页面中的 AI 功能。

CI 在 Linux、Windows、macOS 运行 `pnpm check`；`main` 的 push 仅在全部检查通过后更新原有 `dist` 部署分支。Dependabot 每周提出依赖与 Actions 更新 PR。

## 📦 起步

### 获取项目

```sh
# github
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git
```

### 拉取依赖

```sh
pnpm install --frozen-lockfile
```

### 测试项目

```sh

pnpm test:run
```

### 启动项目

```sh
pnpm dev
```

### 项目打包

```sh
pnpm build
```

### 预览项目

```sh
pnpm preview
```

### 体积分析

```sh
pnpm report
```

### 快速开发

只需要删除 `views/demo`, `router/modules/demo` 下的文件即可得到一个干净的项目模板。

## 🪴 项目活动

![Alt](https://repobeats.axiom.co/api/embed/fab6071297ab281913a42f07a2779b488cfd62b8.svg 'Repobeats analytics image')

### 贡献者

感谢他们的所做的一切贡献 🐝 ！

<a href="https://github.com/XiaoDaiGua-Ray/ray-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=XiaoDaiGua-Ray/ray-template" />
</a>

## 浏览器支持

构建目标为 Vite 8 Baseline Widely Available：Chrome/Edge 111+、Firefox 114+、Safari/iOS 16.4+。功能变化仍需在实际浏览器验证；不支持 IE。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             not support                                                                                              |                                                                                            last 2 versions                                                                                             |                                                                                                  last 2 versions                                                                                                  |                                                                                                last 2 versions                                                                                                |                                                                                                last 2 versions                                                                                                |

## 📄 证书

[MIT License](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/LICENSE) © 2022-PRESENT [Ray](https://github.com/XiaoDaiGua-Ray)

## Hooks、布局与图标

- [Hooks 示例与约定](src/hooks/README.md)：`/template-hooks`、`/web-hooks`，覆盖 19 个自定义 Hook。
- [布局模式与插槽](src/layout/README.md)：`/layout-demo`，可即时调整并保存偏好。
- [分包图标与类型提示](src/icons/A_README.md)：`/svg-icons`；使用 `pnpm icons:generate` 与 `pnpm icons:check` 维护名称。
- [全局状态](src/store/README.md)：临时状态归入 Pinia `runtime`，偏好保留在 `setting`。
