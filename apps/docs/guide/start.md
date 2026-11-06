# 快速开始

本文使用 Ray Template v6。v5 项目请先查看[版本分界](../migration)。

可以选择独立的纯前端源码发行包；完整源码还提供可选的后端接入流程，见[发行版本与快速启动](./distributions)。

## 启动工作台

准备 Node.js 26.13.0 和 pnpm 12.16.1。以下以 nvm 为例：

```sh
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git
cd ray-template
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm env:check
pnpm dev
```

打开 [http://127.0.0.1:9527/ray-template/](http://127.0.0.1:9527/ray-template/)，如果端口被占用，以 Vite 输出的地址为准。使用预填表单登录，再打开「表格 → 远端查询与分页」或「布局实验室」。也可直接体验[在线演示](https://xiaodaigua-ray.github.io/ray-template/)。

::: warning 演示与真实业务
预填表单、会话和 Mock 用于展示前端工作流。对外部署真实业务前，接入自己的认证、服务端权限校验和 API。
:::

## 启动文档

在同一个工作区运行 `pnpm docs:dev`。按终端地址打开 `/ray-template/docs/`，可以直接操作 TablePro、条码和布局示例。

## 相关文档

[第一个业务页面](./first-page) · [v5 与 v6 的版本分界](../migration) · [工程检查与部署](./tooling)

[运行时与依赖清单](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/package.json) · [项目目录与启动链路](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md)
