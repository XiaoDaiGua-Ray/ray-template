# Ray Template 文档

[旧站](https://xiaodaigua-ray.github.io/ray-template-doc/) · [模板源码](https://github.com/XiaoDaiGua-Ray/ray-template) · [在线演示](https://xiaodaigua-ray.github.io/ray-template/)

从同级文档仓库的本地提交 `e01751223cc91f9288484f6e7f50481b9482261d` 导入站点。旧正文可在[历史版本](https://github.com/XiaoDaiGua-Ray/ray-template-doc/tree/0cae0e4334b16df22d491401c190360af4819025)查阅。

## 本地开发

在 Ray Template 仓库根目录执行。Node 和 pnpm 以 `.nvmrc` 和根 `package.json` 为准。

```sh
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:check
pnpm docs:preview
```

按终端地址访问 `/ray-template/docs/`。`pnpm docs:check` 验证示例类型、站内链接和生产构建，产物位于 `apps/docs/.vitepress/dist`。`pnpm check` 包含此检查。生产部署使用根目录的 `pnpm pages:build`，在 `dist/pages/docs` 生成文档。指定 `RAY_TEMPLATE_SITE_ORIGIN` 后还会生成 `dist/legacy-docs`，作为原文档站的跳转产物。

- `guide/`：上手、开发和部署任务。
- `migration.md`：旧写法、新写法、兼容边界和验证方法。
- `reference/`：组件、Hooks、Store、指令、工具和配置的 API 参考。
- `examples/`：页内交互使用的 Vue 源文件，Markdown 直接引用同一文件展示代码。
- `.vitepress/`：主题、导航和旧路径映射。迁址保留的相对路径会在生产构建生成跳转页。

应用变更影响公开 API 时，同步更新对应文档和示例。示例直接使用 workspace 包的公开入口。外壳预览使用文档自己的内存路由和示例菜单。预览生产构建，检查导航、搜索、主题、窄屏、旧路径和受影响示例。

轻量示例直接在文档中运行。依赖后台上下文的示例嵌入同一版本的 `example.html`，只注册演示路由，普通缓存和 Store 状态留在该示例实例；TablePro 列显隐缓存使用独立的会话命名空间，允许在同一标签页刷新验证。Markdown 从实际运行的文件引用源码。开发时同时运行 `pnpm dev` 和 `pnpm docs:dev`；后台端口不是 9527 时，为文档开发服务器设置 `VITE_RAY_EXAMPLE_ORIGIN`（例如 `http://127.0.0.1:9528`）。

验收全部示例请运行 `pnpm pages:build`，然后用 `pnpm preview --outDir ../../dist/pages` 在同一地址预览后台和文档，打开 `/ray-template/docs/`。只运行 `pnpm docs:preview` 时，可预览文档和直接运行的轻量示例。
