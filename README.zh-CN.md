# Ray Template · Vue 3 中后台管理模板

[English](README.md) · **[在线演示](https://xiaodaigua-ray.github.io/ray-template/)** · **[在线文档](https://xiaodaigua-ray.github.io/ray-template/docs/)** · [快速开始](#快速开始)

Ray Template 是一套**开箱即用的中后台前端模板**，适合搭建管理后台、运营工作台和内部工具。克隆后即可体验带权限菜单和多标签页的工作台，也可以直接把 TablePro 列表页、布局和路由模块用在业务里。

**Ray Template 6.0.0 是新的主版本。** v6 以 Monorepo 组织 Ray Admin、官网文档和共享包。它不承诺兼容 v5 的内部导入、接口、部署配置或浏览器数据，也不提供原地升级。现有 v5 项目可以继续使用 [legacy/v5](https://github.com/XiaoDaiGua-Ray/ray-template/tree/legacy/v5)（最后的 v5 主线快照 `6f095b7`，清单版本 `5.2.5`），或使用已打标签的 [v5.2.4](https://github.com/XiaoDaiGua-Ray/ray-template/tree/v5.2.4)。

[版本分界与接入说明](apps/docs/migration.md) · [v6 架构指南](apps/docs/guide/architecture.md)

**技术栈**：Vue 3 · TypeScript / TSX · Naive UI · Vue Router · Pinia · Vue I18n · Vite / Rolldown · Axios · Vitest

[![Ray Template 的 TablePro 人员列表，展示查询表单、分页、列设置及侧栏导航](docs/assets/tablepro-preview.jpg)](https://xiaodaigua-ray.github.io/ray-template/)

用演示页预填的表单登录，在「表格 → 远端查询与分页」可以体验图中的列表，或打开「布局实验室」调整工作台。

## 核心能力

### TablePro：从纯表格到业务列表

同一个 `RTablePro` 可以用 `bare` 只渲染表格，也可以接入搜索、分页和工具栏。列定义、行选择、排序和自定义单元格沿用 Naive UI DataTable 的写法。

- **查询和分页**：传入本地数据 `data`，或提供返回 `{ data, total }` 的 `request(params, signal)`。远端模式只接收最新请求的结果，失败时保留已有数据并提供重试。
- **长列表和列设置**：表格可填充工作区，配合虚拟滚动；用户可调整列的显示、顺序和固定位置，通过 `columnStateKey` 跨刷新记住隐藏列。
- **导出与打印**：默认导出和打印当前页的可见数据列。报表、单据等独立排版可指定自定义打印区域。

[TablePro 用法与数据契约](packages/ui/src/RTablePro/README.md)

### 应用外壳：适配不同的后台工作方式

侧栏、顶部、混合导航可切换，窄屏自动改用菜单抽屉。工作区支持定宽或铺满、顶栏与页脚固定、内容最大化；用户的布局偏好由 Pinia 保存。可以在布局实验室实时调试，也可以用具名插槽替换顶栏、侧栏、标签栏和页脚。

标签页可在多个页面之间切换，面包屑标示当前位置，用 `⌘/Ctrl + K` 可以查找菜单。全局提供明暗主题和中英文切换。

[布局实验室源码](apps/admin/src/views/demo/layout-demo.tsx) · [布局配置与插槽](apps/admin/src/layout/README.md)

### 路由模块：把页面、菜单与权限放在同一处配置

先在 `apps/admin/src/router/config/views.ts` 登记页面组件 ID，再由接口返回路由记录，模板据此生成菜单和面包屑。Mock 初始记录位于 `apps/admin/src/mocks/data/routes.json`。路由 `meta` 可以配置菜单文案与图标、角色、显示条件和 `keepAlive`。从列表进入详情时，可以保留当前菜单和标签页，只在面包屑中补充详情层级。角色配置同时用于菜单过滤和直接导航时的守卫。接入业务时，由后端校验会话与接口权限。

[路由与菜单约定](apps/admin/src/router/README.md) · [多级菜单与缓存示例](apps/admin/src/mocks/data/routes.json)

### 组件、Hooks 与图标：从可运行的示例里复用

- **组件**：`RForm` 和 `RModal` 用于表单和弹窗场景，`RChart` 封装 ECharts 实例的初始化、尺寸与主题同步；另有 LogicFlow 流程图、条形码和拖拽卡片示例。[组件入口与约定](apps/admin/src/components/README.md)
- **Hooks**：模板 Hooks 处理页面刷新、内容最大化、菜单标记和水印；Web Hooks 展示截图、打印和元素全屏。交互示例提供可展开的用法代码。[Hooks 示例](apps/admin/src/hooks/README.md)
- **SVG**：把文件放入 `packages/icons/src` 的对应分包即可生成类型提示和雪碧图。路由和 `RIcon` 使用同一套完整名称，例如 `navigation/dashboard`，图标库可按分包查找并复制 TSX 用法。[图标生成与使用](packages/icons/src/A_README.md)

## 快速开始

使用仓库固定的 **Node.js 26.13.0** 和 **pnpm 12.16.1**。以下以 nvm 为例：

```sh
git clone https://github.com/XiaoDaiGua-Ray/ray-template.git
cd ray-template
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

打开 [http://127.0.0.1:9527/ray-template/](http://127.0.0.1:9527/ray-template/)，或使用 Vite 输出的地址。预填的演示账号可直接登录，本地开发无需先搭建业务后端。

在同一个仓库运行 `pnpm docs:dev`，可维护[读者文档和页内交互示例](apps/docs/README.md)。

## 工程结构

```text
ray-template/
├── apps/
│   ├── admin/          # Ray Admin：业务页面、会话、权限、环境文件和 Mock
│   └── docs/           # VitePress：官网、API 参考和交互示例
├── packages/
│   ├── admin-shell/    # 布局、导航、标签、设置和路由过渡
│   ├── ui/             # TablePro、RBarcode、RChart 等共享组件
│   ├── composables/    # 独立的 Vue Hooks 和浏览器工具
│   ├── directives/     # Vue 指令
│   ├── icons/          # SVG 资源、名称类型和清单
│   ├── routing/        # 路由配置契约、校验和菜单处理
│   ├── http/           # 请求客户端、拦截器和请求取消
│   └── utils/          # 精度运算、对象和存储工具
├── harness/            # 回归检查与报告
└── pnpm-lock.yaml      # 工作区共用锁文件
```

Ray Admin 在 `apps/admin/src/main.ts` 初始化应用，在 `App.tsx` 注入主题、翻译、图标和列偏好存储。共享包通过 `exports` 提供入口。文档从相同入口运行真实示例；例如 [TablePro](apps/docs/reference/table-pro.md) 用模拟数据展示请求取消与失败重试，[布局实验](apps/docs/guide/layout.md) 使用独立的内存路由。

模块之间的调用关系见[架构地图](docs/architecture.md)。

## 从示例改出第一个业务页面

下面是人员列表的最小接入。它使用仓库自带的 Mock 查询函数；换成订单或库存列表时，替换列定义、搜索字段与请求函数即可。

```tsx
import { getPersonList } from '@/api/demo/mock/person'
import { RTablePro } from '@ray-template/ui/table-pro'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => (
      <RTablePro
        columns={[
          { title: '姓名', key: 'name' },
          { title: '邮箱', key: 'email' },
        ]}
        request={getPersonList}
        search={[{ key: 'name', label: '姓名' }]}
        columnStateKey="demo:people"
      />
    )
  },
})
```

1. **写页面**。在 `apps/admin/src/views` 新建页面，参考[远端查询示例](apps/admin/src/views/demo/tables/remote.tsx)加入排序、行选择和工具栏。
2. **接入导航**。登记页面组件 ID，在 Mock JSON 或后端响应中添加路由，给菜单配置中英文文案。页面需要缓存时，参考[路由约定](apps/admin/src/router/README.md)配置路由与组件名称。
3. **替换演示数据**。从 `apps/admin/src/api` 接入业务接口，通过 `apps/admin/src/axios` 统一处理拦截与取消，再接入实际登录和会话。开发和静态预览共用 HTTP Mock。[服务端契约](apps/docs/guide/backend.md) 提供会话、权限码、用户和路由接口及可下载的 OpenAPI。[请求层说明](apps/admin/src/axios/README.md)

## 检查、构建与部署

| 命令                          | 用途                                                          |
| ----------------------------- | ------------------------------------------------------------- |
| `pnpm test:run`               | 运行 Vitest 测试                                              |
| `pnpm check`                  | 执行 CI 同款检查，包含类型、Lint、格式、测试和生产构建        |
| `pnpm harness context`        | 按路由、UI、API 等任务域查找源码入口和验证命令                |
| `pnpm harness verify <scope>` | 执行定向检查并保存本地报告；集成风险或发布使用 `all` 全量检查 |
| `pnpm build` / `pnpm preview` | 输出到 `dist/production`，或在本机预览构建                    |

`pnpm docs:build` 单独构建文档。`pnpm pages:build` 组装后台与文档到 `dist/pages`，分别服务于 `/ray-template/` 和 `/ray-template/docs/`。

二次开发可从[架构地图](docs/architecture.md)定位配置与模块。部署到域名根目录或子路径、为公开站点启用搜索元数据时，参考[部署指南](docs/architecture.md#deployment-and-search-discovery)。人工和 AI 协作共用 [AGENTS.md](AGENTS.md) 与 [AI Harness](harness/README.md)。

[MIT 许可证](LICENSE) · [更新日志](CHANGELOG.md) · [问题反馈](https://github.com/XiaoDaiGua-Ray/ray-template/issues)

从[任务索引](llms.txt)查找实现归属、调用方和验证方式，无需安装依赖。`pnpm harness context <scope>` 显示同一份索引及验证命令。
