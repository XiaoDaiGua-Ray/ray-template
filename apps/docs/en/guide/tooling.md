# Checks and deployment {#工程检查与部署}

## Common commands {#常用命令}

| Command                          | Purpose                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm env:check`                 | Verify the Node and pnpm versions and dependency installation.                                       |
| `pnpm dev`                       | Synchronize the icon manifest and start Vite.                                                        |
| `pnpm harness context`           | List task areas. Add `routing`, `table-pro`, or `docs` for implementation and verification pointers. |
| `pnpm harness verify table-pro`  | Run targeted tests or project checks for the selected scope.                                         |
| `pnpm harness verify all`        | Run full checks and write a local report for integration risk or releases.                           |
| `pnpm typecheck`                 | Validate the icon manifest and check types for the application, Node configuration, and tests.       |
| `pnpm dev-build` / `pnpm report` | Create a development build or static bundle report.                                                  |
| `pnpm build` / `pnpm preview`    | Build and preview the admin artifact locally.                                                        |
| `pnpm packages:check`            | Check public entry points, dependency declarations, and cycles.                                      |
| `pnpm pages:build`               | Assemble the admin and docs in `dist/pages`.                                                         |
| `pnpm docs:dev`                  | Start the docs development server.                                                                   |
| `pnpm docs:check`                | Check docs example types and internal links, and build the site.                                     |
| `pnpm docs:preview`              | Preview the built documentation site.                                                                |

For routine changes, run the relevant test files or `pnpm harness verify <scope>`, then add formatting, ESLint, and type checks as the diff requires. Wording, comment, and maintainer documentation edits can use source review and formatting checks. Run `pnpm harness check` when indexes change. Run full checks once near completion for integration risk such as dependencies, public exports, or build configuration, or when a release or explicit request calls for them. Pages builds independently. The full local entry point is `pnpm check`.

Full checks cover the environment, Harness, API and package boundaries, icon synchronization, types, ESLint, Prettier, Vitest, and both admin and docs builds. `pnpm harness verify` with no scope still runs the full suite. Specify a scope for routine work. Harness saves command results in `.harness-local/runs/`. Browser acceptance runs separately from these commands.

Record browser checks for the affected behavior. Exercise the relevant page for interaction changes, add desktop and narrow widths for layout changes, check light and dark themes for color changes, and check both English and Chinese for copy or localization changes. For shared functionality, choose representative consumers with different usage. Logic, maintainer notes, and prose-only reader documentation can be verified without a browser. Once a check passes, rerun it only if a later change affects it.

## Deploy under a subpath {#部署到子路径}

`pnpm build` outputs `dist/production`. Deploy it at the path configured as `base` in `vite.custom.config.ts`. The default application base is `/ray-template/`. Use `/` to deploy at the domain root. Vite bundles local dependencies by default. If using the optional CDN mode, verify CDN access in the target environment.

Run `pnpm pages:build` for a combined site in `dist/pages`. The hosted admin lives at `/ray-template/`, the v6 docs at `/ray-template/docs/`, and the English docs at `/ray-template/docs/en/`. The Pages workflow builds on Ubuntu 24.04 for each push to `main` and deploys a GitHub Pages artifact. Manual publication from `main` is also available. Set `RAY_TEMPLATE_SOURCE_REF` at build time to pin documentation source links to the release commit. In the repository, choose **GitHub Actions** under **Settings → Pages → Source** and confirm that the `github-pages` deployment environment allows `main`.

For a public production deployment, set `RAY_TEMPLATE_SITE_ORIGIN` to the actual origin, such as `https://example.com`. The base supplies the path. Admin builds default to `noindex` without that setting. The sitemap lists public entry pages. Signed-in hash routes serve application navigation.

## Development conventions {#二次开发约定}

- Use the Vue 3 Composition API with TSX or follow the existing SFC patterns. Reuse existing components and organize declarations by responsibility.
- Generate Vue, Router, and Pinia auto-import declarations through their generators. Use `import type` for types. The application, tests, and Node configuration have separate TypeScript boundaries.
- Prettier manages formatting. ESLint uses flat config. Follow the repository's current commit and comment conventions.

[Build and deployment entry points](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/architecture.md) · [AI Harness](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/harness/README.md) · [Comment style](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/docs/comment-style.md)
