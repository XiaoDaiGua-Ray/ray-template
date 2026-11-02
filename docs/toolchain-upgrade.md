# 工具链升级记录（2026-11-02）

## 版本基线

版本通过 npm 官方注册表的 `latest` 标签核实，锁文件包含对应的完整解析结果。只使用稳定版，不引入 beta/RC。Node.js 使用当前 LTS 26.13.0，pnpm 固定为 12.16.1；本机验证使用校验 SHA-256 后下载到临时目录的 Node，未替换全局 Node。

| 核心依赖            | 升级前                      | 当前                                     |
| ------------------- | --------------------------- | ---------------------------------------- |
| Node.js（`.nvmrc`） | 22.12.0                     | 26.13.0 LTS                              |
| pnpm                | 未固定，CI 使用 9           | 12.16.1                                  |
| Vite                | 7.2.6                       | 8.3.5                                    |
| Vue                 | 3.5.25                      | 3.5.44                                   |
| Vue Router          | 4.6.3                       | 5.4.0                                    |
| Pinia               | 3.0.3                       | 4.1.0                                    |
| Naive UI            | 2.43.2                      | 2.45.3                                   |
| VueUse              | 13.1.0                      | 15.0.0                                   |
| ECharts             | 6.0.0                       | 6.1.0                                    |
| Axios               | 1.10.0                      | 1.21.0                                   |
| TypeScript          | 5.9.3                       | 6.0.3（兼容上限）                        |
| vue-tsc             | 2.2.8                       | 3.3.14                                   |
| Vitest / UI         | 4.0.12                      | 5.0.5                                    |
| ESLint              | 9.39.1                      | 10.14.0                                  |
| typescript-eslint   | 8.47.0（拆包）              | 8.72.1                                   |
| Prettier            | 3.6.2                       | 3.9.10                                   |
| Husky               | 8.0.3                       | 9.1.7                                    |
| lint-staged         | 15.4.3                      | 17.6.0                                   |
| Mock 数据生成       | Mock.js 1.1.0               | Faker 10.6.0，中文 locale                |
| SVG 雪碧图          | vite-plugin-svg-icons 2.0.1 | @spiriit/vite-plugin-svg-spritemap 7.2.0 |

其余保留的直接依赖也更新为核实到的稳定版并使用精确版本，完整列表见 `package.json`。没有新版本的依赖保留其已有最新版本。

## 必要适配

- 可选 CDN 改为 jsDelivr 的 npm 精确版本路径，使用发布包中实际存在的生产文件；移除已经不在依赖中的 dom-to-image 条目。默认仍使用本地 bundle。
- Vite 8 使用 Rolldown/Oxc：移除无效 `build.transpile`，使用 `rolldownOptions` 和 Oxc 压缩参数，交由原生依赖图拆包；保留路由懒加载、压缩文件、部署 base 与各模式输出目录。
- Node 配置使用 ESM 路径解析、显式 `.ts` 扩展名和 JSON import attributes，为 native config loader 做好适配。别名 `@api` 统一指向实际的 `src/api`，修正 TS `@images/*` 映射。
- 替换旧 SVG 插件的缺失依赖和旧依赖树。`RIcon` 仍按 `prefix + name` 访问图标，新插件生成独立带 hash 的雪碧图并跟随部署 base；`<use>` 使用标准 `href`。
- 移除会在开发/构建时自动修改源码的 `vite-plugin-eslint`；ESLint 10 使用原生 flat config。保留有价值的既有规则，格式交给 Prettier，lint/check 默认只读。
- 更新 Husky 9 hook，移除 Husky 8 的初始化与旧 package.json hooks。暂存检查使用 `--no-warn-ignored`，只抑制显式传入已排除声明文件时的提示，真实 lint warning 仍会失败。移除实际未使用的 Webpack sprite loader、depcheck 和重复 ESLint 预设。
- VueUse 的 `MaybeRef`/`MaybeRefOrGetter` 改从 Vue 导入；Axios 仅在已安装解包响应拦截器的边界公开返回 `data` 的原有接口，补充适配器回归用例。
- 修复 TSX 演示中对解构 `const` 使用 `v-model` 产生的非法赋值，改为绑定组件实例属性。
- Router 5 的权限守卫改为返回路由结果，保留未登录、角色与白名单判断；首页本身无权限时取消导航以免重定向循环，增加真实内存路由测试。
- 开发依赖扫描限定 `index.html`，避免误扫旧构建目录；SVG 预览页的 glob 移到独立 `.ts` 模块，绕过 Vite 8 扫描器将保留 JSX 当作 JS 的限制。待上游支持后可重新评估该拆分。
- Vitest 测试只复用 Vue/TSX 与自动导入转换，不启动 Mock 服务、HTML 注入、图标扫描或压缩插件。修复遗漏 `await` 的断言，更新水印/全屏用例中的过期预期，保留行为断言。
- 既有颜色转换回归暴露 rgba 空格不一致与八位 hex 透明度丢失，已修正；图表异常保留原始 `cause`。
- Mock.js 存在未修复的原型污染公告，且包含直接 `eval`；替换为 Faker 的中文实例，保持人员字段、分页接口和表格示例能力。新版 Mock 插件的 include 相对 `dir` 匹配，修正原先重复的 `mock/` 前缀并等待首次加载，实际验证了 API 响应。
- 浏览器构建和 Autoprefixer 统一到 Vite 8 Baseline Widely Available。开发服务默认 loopback，局域网访问需显式 `--host`。监听排除全部构建目录和 `.ai-local`，避免构建报告时触发页面重复重载。
- CI 与 Docker 使用同一 Node/pnpm，冻结锁文件安装。CI 合并重复流程并覆盖类型、lint、格式、测试、构建；保留检查通过后部署 `main` 到 `dist` 分支的行为。

## 兼容性限制与复查条件

### TypeScript 7

npm 最新为 7.0.2，但 `vue-tsc` 的编译器包装机制尚未完整支持原生 TypeScript 7，`typescript-eslint@8.72.1` 的 peer 范围也明确为 `<6.1.0`。因此采用 6.0.3，而不关闭类型检查或制造 peer 冲突。待这两个上游均明确支持后，再解除 Dependabot 对 TypeScript 7 的限制并运行完整验证。

### 兼容的间接依赖覆盖

`pnpm-workspace.yaml` 中有三个有限范围的覆盖，避免升级后的上游依赖继续锁定有已知公告的旧大版本：

| 覆盖                              | 已核实的调用契约                                | 移除条件                                         |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `@logicflow/core>uuid` → 14.0.3   | LogicFlow 只使用无参数 `v4()` 生成 ID           | LogicFlow 自身升级到已修复版本，且流程图验证通过 |
| `minimatch@>=10 <11.0.1` → 11.0.4 | ESLint 的匹配函数与类接口仍可用，完整 lint 验证 | 上游依赖允许 11+，移除覆盖后审计与 lint 通过     |
| `glob@>=9 <14.0.2` → 14.0.3       | js-beautify CLI 使用 `hasMagic`、`globSync`     | 上游依赖允许已修复版本，移除覆盖后验证通过       |

依赖构建脚本采用 pnpm `allowBuilds` 列表。LogicFlow 的 AI 提示 postinstall 不参与运行时构建，明确禁用；其余仅保留已有原生依赖所需脚本。pnpm 自动记录的 `minimumReleaseAgeExclude` 是本次明确更新到最新稳定版产生的精确版本例外，不是关闭所有供应链检查。

### CryptoJS

CryptoJS 4.2.0 已停止维护，但仍是最后一个发布版本。现有同步 AES 接口和密文格式继续保留；只有在同时设计旧密文迁移、异步接口与调用方适配时，才可替换为 Web Crypto。客户端内置密钥不能视为服务端保密边界。

## 验证记录

在 macOS 本机使用 Node.js 26.13.0 / pnpm 12.16.1 验证：

| 检查                                                                    | 结果                                                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `pnpm env:check`                                                        | 通过；避免与 pnpm 自带 `doctor` 子命令冲突                                                                 |
| 冻结锁文件安装、`pnpm peers check`                                      | 通过，无 peer 冲突                                                                                         |
| 全新临时目录 `CI=true HUSKY=0 pnpm install --frozen-lockfile --offline` | 通过，从缓存重建依赖，无需原有 node_modules                                                                |
| `pnpm check`                                                            | 类型、ESLint（零 warning）、Prettier、42 个测试文件 / 146 条测试、生产构建通过                             |
| `pnpm dev-build`                                                        | 通过，输出 `dist/development` 与 sourcemap                                                                 |
| `pnpm report`                                                           | 通过，静态报告为 `dist/report/stats.html`，不打开浏览器或保持报告服务器                                    |
| `vite build --configLoader native`                                      | 通过，配置不依赖旧加载器的扩展名猜测                                                                       |
| 可选 CDN 构建                                                           | 通过；实际引用的 9 个精确版本脚本 URL 全部 HTTP 200，Chrome 登录、首页与 SVG 预览无控制台 error            |
| `pnpm audit`                                                            | 0 info / low / moderate / high / critical；无忽略公告配置                                                  |
| `pnpm outdated`                                                         | 仅报告 TypeScript 7 的兼容例外与最后版本 CryptoJS 的弃用标记                                               |
| 三个间接依赖覆盖的 API                                                  | `uuid.v4/validate`、`globSync/hasMagic`、`minimatch/Minimatch` 调用通过                                    |
| commitlint                                                              | 合规消息通过，错误格式消息被拒绝                                                                           |
| Mock HTTP API                                                           | `/api/list?page=2&pageSize=10` 返回 10 条 / total 100；无分页返回 100 条，字段与年龄范围通过               |
| Chrome 开发页面                                                         | 演示登录、首页、SVG 菜单图标、ECharts 图表、LogicFlow 节点和二维码渲染通过                                 |
| Chrome 生产预览                                                         | 登录、首页显示真实依赖版本、高级表格中文数据、10→20 条切换、中英文菜单和明暗主题通过，检查时控制台无 error |

截图等本机证据位于忽略目录 `.ai-local/evidence/`。`production-home.png` 为生产首页，`production-table-dark.png` 为英文菜单和深色表格，`cdn-svg-icons.png` 为 CDN 构建的图标预览。临时安装、CDN 验证配置和产物不进入提交。

CI 工作流仅完成配置和官方 Action 输入核对，尚未在远端执行。当前机器未安装 Docker，因此 Dockerfile 未做实际镜像构建；也未验证真实后端、无界宿主、其他浏览器、最低版本设备和完整打印/下载链路。

生产构建仍提示一个约 2 MB 的公共 chunk（包含模板公共组件依赖）及 ContentWrapper 同时静态/动态导入；功能检查通过，未提高告警阈值来隐藏问题。后续若做性能专项，应基于静态报告拆解组件导出与加载边界，并重新验证路由缓存及初始化顺序。

## 参考资料

- [Node.js 26.13.0 LTS](https://nodejs.org/en/blog/release/v26.13.0)
- [Vite 8 迁移说明](https://vite.dev/guide/migration)
- [Vitest 5 迁移说明](https://vitest.dev/guide/migration/)
- [Vue Router 5 迁移说明](https://router.vuejs.org/guide/migration/v4-to-v5)
- [Vue Language Tools 的 TypeScript 7 支持进度](https://github.com/vuejs/language-tools/issues/5381)
- [SVG Spritemap 子路径部署](https://spiriitlabs.github.io/vite-plugin-svg-spritemap/guide/deployment.html)
- [Faker 本地化](https://fakerjs.dev/guide/localization.html)
