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

English | [简体中文](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/README.zh-CN.md)

A `completely free`, `efficient`, `feature complete` and based on Vite 8, TypeScript, Pinia and Vue 3 in the background template.

</div>

## 🌻 Intro

`Ray Template` uses cutting-edge front-end technology, abandoning complexity and bloat, using modular design, decoupling data, methods and views, focusing on business development. Provide rich configuration and rich template `Hooks`, support personalized customization, to meet your project needs.

## ✨ Features

- `New technology stack:` using Vue 3 + TSX, Vite 8 / Rolldown, Pinia 4, Vue Router 5 and Naive UI
- `Theme:` configurable theme
- `Internationalization:` built-in perfect internationalization solution
- `Permissions:` built-in perfect dynamic routing permission generation solution
- `Components:` secondary encapsulation of multiple common components
- `Toolkit:` common tool function packaging
- `Cache:` arbitrary depth page caching
- `Modular design:` decoupling management data, methods, views, rest assured secondary development
- `Configurable:` support rich configuration items
- `Code style:` built-in prettier, eslint and other code style tools
- `Multi-terminal adaptation:` support pc, phone, pad
- `Documentation:` complete documentation
- `Mock data:` built-in Mock data solution
- `Axios request:` the plug-in design is used to encapsulate the axios library interceptor twice, which makes the interceptor more flexible
- `SVG:` built-in svg icon solution
- `Hooks:` based on the template characteristics of the encapsulated hooks to make it easier to use some functions of the template
- `TypeScript:` provide a complete type
- `Vitest:` built-in vitest test solution

## 👀 Preview

- [Preview](https://xiaodaigua-ray.github.io/ray-template/#/)

## 📌 Documentation

- [Documentation](https://xiaodaigua-ray.github.io/ray-template-doc/)

## 🔋 Change Log

- [Change Log](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/CHANGELOG.md)

## 🪴 Prepare

- [Node](https://nodejs.org/) and [git](https://git-scm.com/) - project development environment
- [Vite](https://vite.dev/) - familiar with vite features
- [Vue3](https://vuejs.org/) - familiar with Vue basic syntax
- [TypeScript](https://www.typescriptlang.org/) - familiar with TypeScript basic syntax
- [ES6+](http://es6.ruanyifeng.com/) - familiar with es6 basic syntax
- [Vue-Hooks-Plus](https://inhiblabcore.github.io/docs/hooks/) - familiar with vue-hooks-plus useRequest method basic use
- [Vue-Router-Next](https://router.vuejs.org/) - familiar with vue-router4.x basic use
- [Naive-UI](https://www.naiveui.com) - naive ui basic use
- [Faker](https://fakerjs.dev/) - localized demo data with vite-plugin-mock-dev-server
- [Pinia](https://pinia.vuejs.org/zh/introduction.html) - state manager pinia usage
- [TSX](https://github.com/vuejs/babel-plugin-jsx/blob/main/packages/babel-plugin-jsx/README-zh_CN.md) - tsx basic syntax
- [Vitest](https://cn.vitest.dev/guide/) - vitest basic use

## Toolchain and AI-assisted development

Use Node.js **26.13.0 LTS** and pnpm **12.16.1**. Versions are pinned in `.nvmrc`, `package.json` and `pnpm-lock.yaml`. All retained direct dependencies use current stable versions, except TypeScript **6.0.3**: Vue Language Tools and typescript-eslint do not yet support TypeScript 7. See [upgrade notes and verification](docs/toolchain-upgrade.md).

The example uses nvm; with fnm, replace the first two commands with `fnm install && fnm use`.

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm env:check
pnpm check
```

| Command                           | Purpose / output                                           |
| --------------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                        | Start development at `http://127.0.0.1:9527/ray-template/` |
| `pnpm typecheck`                  | Check application, test and build configuration types      |
| `pnpm lint` / `pnpm format:check` | Read-only lint / formatting checks                         |
| `pnpm lint:fix` / `pnpm format`   | Explicit code fixes / formatting                           |
| `pnpm test:run`                   | Run unit tests once; `pnpm test` starts watch mode         |
| `pnpm build`                      | Typecheck and build into `dist/production`                 |
| `pnpm dev-build`                  | Build with sourcemaps into `dist/development`              |
| `pnpm preview`                    | Serve the production build locally                         |
| `pnpm report`                     | Write a static bundle report without opening a browser     |
| `pnpm check`                      | Typecheck, lint, format, unit tests and production build   |

CLI commands return a nonzero exit code on failure. Use `pnpm dev --host 0.0.0.0` only when you need LAN access. Build modes, CDN configuration, aliases and the deployment base are in `vite.custom.config.ts`.

AI assistants share the repository's [AGENTS.md](AGENTS.md), [architecture map](docs/architecture.md) and [development guide](docs/ai-development.md). Codex, Cursor, Copilot and Claude have thin entry points into the same rules. This provides AI-assisted engineering without requiring model API keys or adding AI product features.

CI runs `pnpm check` on Linux, Windows and macOS. Only successful `main` pushes deploy to the existing `dist` branch. Dependabot proposes weekly dependency and Actions updates.

## 📦 Setup

### Get Project

```sh
# github
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git
```

### Pull dependencies

```sh
pnpm install --frozen-lockfile
```

### Test project

```sh

pnpm test:run
```

### Startup project

```sh
pnpm dev
```

### Build project

```sh
pnpm build
```

### Preview project

```sh
pnpm preview
```

### Report project

```sh
pnpm report
```

### Development

Just delete the files under `views/demo`, `router/modules/demo` to get a clean project template.

## 🪴 Project Activities

![Alt](https://repobeats.axiom.co/api/embed/fab6071297ab281913a42f07a2779b488cfd62b8.svg 'Repobeats analytics image')

### Contributors

Thanks for all their contributions 🐝 !

<a href="https://github.com/XiaoDaiGua-Ray/ray-template/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=XiaoDaiGua-Ray/ray-template" />
</a>

## Browser Support

Build target: Vite 8 Baseline Widely Available (Chrome/Edge 111+, Firefox 114+, Safari/iOS 16.4+). Test product changes in current browsers; no IE support.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                             not support                                                                                              |                                                                                            last 2 versions                                                                                             |                                                                                                  last 2 versions                                                                                                  |                                                                                                last 2 versions                                                                                                |                                                                                                last 2 versions                                                                                                |

## 📄 License

[MIT License](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/LICENSE) © 2022-PRESENT [Ray](https://github.com/XiaoDaiGua-Ray)
