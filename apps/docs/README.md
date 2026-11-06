# Ray Template documentation

[Legacy site](https://xiaodaigua-ray.github.io/ray-template-doc/) · [Template source](https://github.com/XiaoDaiGua-Ray/ray-template) · [Live demo](https://xiaodaigua-ray.github.io/ray-template/)

Imported from local commit `e01751223cc91f9288484f6e7f50481b9482261d` in the sibling documentation repository. The previous content remains available in the [historical version](https://github.com/XiaoDaiGua-Ray/ray-template-doc/tree/0cae0e4334b16df22d491401c190360af4819025).

## Local development

Run these commands from the Ray Template repository root. Use the Node and pnpm versions specified in `.nvmrc` and the root `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm docs:dev
pnpm docs:check
pnpm docs:preview
```

Open `/ray-template/docs/` at the address printed in the terminal. `pnpm docs:check` checks example types, internal links, and the production build. Output goes to `apps/docs/.vitepress/dist`. `pnpm check` includes this check. For production deployment, run `pnpm pages:build` from the root; it generates documentation under `dist/pages/docs`. Setting `RAY_TEMPLATE_SITE_ORIGIN` also generates `dist/legacy-docs` for redirects from the previous documentation site.

- `guide/`: Getting started, development, and deployment tasks.
- `migration.md`: Previous and current usage, compatibility boundaries, and verification methods.
- `reference/`: API references for components, hooks, stores, directives, utilities, and configuration.
- `examples/`: Vue source for interactive examples; Markdown displays code from those same files.
- `.vitepress/`: Theme, navigation, and legacy path mappings. Production builds generate redirect pages for preserved legacy relative paths.

When application changes affect public APIs, update the corresponding documentation and examples. Examples use public workspace package entry points. Shell previews have their own in-memory router and example menus. Follow the [documentation workflow](../../docs/docs-handoff.md#update-workflow) to check affected content. Verify navigation, search, themes, narrow layouts, legacy paths, and interactions only when they change; use production previews for production paths and release verification.

Lightweight examples run directly in the documentation. Examples that need the admin application context embed `example.html` from the same version, register only demo routes, and keep ordinary cache and store state within the example instance. TablePro column visibility uses a separate session namespace so it can be checked across reloads in the same tab. Markdown includes source from the file actually running. During development, run both `pnpm dev` and `pnpm docs:dev`. If the admin server uses a port other than 9527, set `VITE_RAY_EXAMPLE_ORIGIN` for the documentation server, for example `http://127.0.0.1:9528`.

To verify embedded admin examples or the combined deployment, run `pnpm pages:build`, then `pnpm preview --outDir ../../dist/pages`. Open `/ray-template/docs/` at that shared address and exercise only affected examples. Expand to all examples for a release or an explicit request. `pnpm docs:preview` alone previews the documentation and its directly hosted lightweight examples.
