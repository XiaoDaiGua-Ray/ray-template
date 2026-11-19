# Quick start {#快速开始}

This guide uses Ray Template v6. For a v5 project, start with [Moving from v5 to v6](../migration).

The standalone frontend source distribution runs on its own. The full source also includes an optional backend. [Source distributions and startup](./distributions)

## Start the admin workspace {#启动工作台}

Use Node.js 26.13.0 and pnpm 12.16.1. The commands below use nvm.

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

Open [http://127.0.0.1:9527/ray-template/](http://127.0.0.1:9527/ray-template/). If the port is in use, use the address Vite prints. Sign in with the prefilled form and try the remote query and pagination example under Tables or open the layout playground. You can also use the [live demo](https://xiaodaigua-ray.github.io/ray-template/).

::: warning Demo and production use
The prefilled sign-in form, demo sessions, and mocks illustrate frontend workflows. Connect your own authentication, server-side authorization, and APIs before deploying a production application.
:::

## Start the documentation site {#启动文档}

Run `pnpm docs:dev` in the same workspace. Use the address printed in the terminal and open `/ray-template/docs/en/` to try the TablePro, barcode, and layout examples.

## Related documentation {#相关文档}

[Your first business page](./first-page) · [Moving from v5 to v6](../migration) · [Checks and deployment](./tooling)

[Runtime and dependency manifest](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/package.json) · [Workspace structure and startup](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md)
