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

## 2026-11-03：Hooks、布局和图标改造验证

未升级依赖或改动锁文件。新增 `icons:generate` / `icons:check`，生成脚本使用项目现有 Prettier 配置输出代码，并保留 ESLint 所需的声明空行。Vite 按顶层分包生成独立雪碧图，名称与类型来自同一目录清单。

| 检查                                                            | 实际结果                                                                                                                                                                                |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js 26.13.0、pnpm 12.16.1、冻结锁文件安装、`pnpm env:check` | 通过；本机原有 Node 26.12.1 低于项目要求，本轮使用临时 26.13.0 运行时                                                                                                                   |
| `pnpm typecheck`（包含 `icons:check`）、`pnpm lint`             | 通过，未降低规则或增加全局忽略                                                                                                                                                          |
| `pnpm format:check` / `pnpm check`                              | 格式检查报本地 `TODO.md` 与 `.vscode/settings.json`，保留这两项非本任务变更；`pnpm check` 在格式阶段停止，未声称全绿                                                                    |
| 本任务修改与新增文件的 Prettier 检查                            | 通过；生成清单也由项目 Prettier 配置直接格式化                                                                                                                                          |
| `pnpm test:run`                                                 | 单独继续执行，50 个测试文件 / 173 条测试全部通过                                                                                                                                        |
| `pnpm exec vite build`                                          | 单独继续执行并通过；44 个图标输出为 7 个带 hash 的独立包，各包 symbol ID 无重复                                                                                                         |
| Chrome 开发版                                                   | 侧边、顶部、混合导航；嵌套页面菜单匹配；定宽 1200px 居中；390px 抽屉打开、选中自动收起且无页面横向溢出；刷新后保留桌面偏好；PNG 截图与元素全屏/恢复                                     |
| Chrome 生产预览                                                 | 演示登录、44 个图标渲染、7 个带 base 的图标资源路径、完整图标复制操作、深色主题、中英文新页面文本、内容最大化及 Esc、页面卸载后刷新恢复、内容滚动到 300px、滚动页脚与既有自适应表格渲染 |

Pinia 设置沿用原持久化 key，旧裸 Logo 名称在读取时迁移；锁屏仍使用历史布尔值格式。对应迁移、并发刷新、滚动实例替换、导航越界、右键异步关闭、全屏帧清理及截图失败处理均有回归用例。

本机截图位于 `.ai-local/evidence/2026-11-03/`。文件监听首次触发 EMFILE，本轮开发服务使用 `CHOKIDAR_USEPOLLING=1` 进行验收，未将该环境绕行写入默认开发配置。保留公共 chunk 大小、ContentWrapper 静态/动态导入及 Mock CORS 序列化提示；未调整告警阈值。本轮未验证实际纸张打印、最低版本浏览器或无界宿主。

## 2026-11-03：自动同步、注释规范与视觉整理

本轮未升级依赖、未改动锁文件。图标生成已接入 `dev`、`build`、`dev-build`、`report`、`check` 与 Vite 构建入口；独立 `typecheck` 和 `icons:check` 保持只读。`AGENTS.md` 引入 [统一注释规范](comment-style.md)，页面排版与主题入口见 [视觉约定](ui-design.md)。

| 检查                              | 实际结果                                                                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 冻结锁文件安装与 `pnpm env:check` | 通过，使用 Node.js 26.13.0 / pnpm 12.16.1                                                                                                                                    |
| `pnpm check`                      | 图标同步、类型和 ESLint 通过；格式阶段仅报未改动的 `.vscode/settings.json`，未声称全量检查通过                                                                               |
| `pnpm test:run`                   | 单独执行，52 个测试文件 / 181 条测试全部通过                                                                                                                                 |
| `pnpm build`                      | 通过，包含自动生成、类型检查和生产构建；最终为 44 个图标、7 个独立雪碧图                                                                                                     |
| 无开发服务参与的构建              | 临时新增 SVG 后先确认 `icons:check` 报清单过期，再直接执行 `pnpm build`，自动生成成功；删除临时 SVG 后再次构建恢复最终产物                                                   |
| 实际图标 HMR                      | 新增、改名、删除自动同步清单；修改内容后资源 hash 改变且保留搜索状态；新增/删除整个分包自动重建插件配置并通知浏览器重载；带连字符的分包名与符号链接路径的 CLI 执行有回归覆盖 |
| 注释位置                          | 移除组件介绍块和重复堆叠；类型、Store 与常量说明按相邻声明重新核对，修正原登录状态说明中错误的存储介质描述                                                                   |
| Chrome 排版                       | 工作台、Hooks、布局实验室、图标库；1440/1280px 桌面与 390px 单列，无页面横向溢出；保留登录页紧凑资源入口                                                                     |
| 主题与语言                        | 生产页明暗切换、暗色选中态前景、中英文标题；修复热更新后国际化实例被替换导致显示原始键的边界，并覆盖初始化前创建 Hook 后恢复翻译的场景                                       |

开发验收仍使用本机 `CHOKIDAR_USEPOLLING=1`，未改动默认监听方式。浏览器控制连接在还原视口时中断，后续通过 Chrome 开发者工具的独立上下文核对最终生产产物；最终截图与阶段记录放在 `.ai-local/evidence/2026-11-03/polish/`。复杂基础组件自身的 Vue JSX 热替换场景未穷尽，生产验收基于最终完整加载的产物；没有把这些检查写成真实后端、最低版本设备或实体打印验收。

公共 chunk 大小、ContentWrapper 静态/动态导入与 Mock CORS 序列化提示仍保留，未降低检查严格度或调高告警门槛。

## 2026-11-03 TypeScript 项目配置拆分

旧配置只在 `vue-tsc` 命令行传入 `--noEmit`。直接读取项目配置时，`allowImportingTsExtensions` 会触发 TS5096。现在共享配置声明 `noEmit`，由根项目分别引用应用、Node 与测试配置。Vue JSX 和自动导入声明由应用及测试配置加载。TypeScript 6 的 `DOM` 已包含可迭代声明，Vite 继续通过 `build.sourcemap` 控制开发和生产的 sourcemap。

依赖与锁文件沿用当前版本。完整命令和项目归属见 [TypeScript 项目配置](ai-development.md#typescript-项目配置)。

在 Node.js 26.13.0 与 pnpm 12.16.1 下，`pnpm check` 通过类型、ESLint、Prettier、59 个测试文件的 240 个用例和生产构建。`pnpm dev-build` 通过，并生成开发版 JS sourcemap。通过 TypeScript 服务核对了应用入口、Vite 配置、Mock 文件和测试文件各自使用的项目。

## 参考资料

- [Node.js 26.13.0 LTS](https://nodejs.org/en/blog/release/v26.13.0)
- [Vite 8 迁移说明](https://vite.dev/guide/migration)
- [Vitest 5 迁移说明](https://vitest.dev/guide/migration/)
- [Vue Router 5 迁移说明](https://router.vuejs.org/guide/migration/v4-to-v5)
- [Vue Language Tools 的 TypeScript 7 支持进度](https://github.com/vuejs/language-tools/issues/5381)
- [SVG Spritemap 子路径部署](https://spiriitlabs.github.io/vite-plugin-svg-spritemap/guide/deployment.html)
- [Faker 本地化](https://fakerjs.dev/guide/localization.html)
