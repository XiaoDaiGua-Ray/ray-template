# Ray Template · Vue 3 中后台管理模板

[English](README.md) · **[在线演示](https://xiaodaigua-ray.github.io/ray-template/)** · **[在线文档](https://xiaodaigua-ray.github.io/ray-template-doc/)** · [快速开始](#快速开始)

Ray Template 是一套**开箱即用的中后台前端模板**，适合搭建管理后台、运营工作台和内部工具。克隆后即可体验带权限菜单和多标签页的工作台，也可以直接把 TablePro 列表页、布局和路由模块用在业务里。

**技术栈**：Vue 3 · TypeScript / TSX · Naive UI · Vue Router · Pinia · Vue I18n · Vite / Rolldown · Axios · Vitest

[![Ray Template 的 TablePro 人员列表，展示查询表单、分页、列设置及侧栏导航](docs/assets/tablepro-preview.jpg)](https://xiaodaigua-ray.github.io/ray-template/)

用演示页预填的表单登录，在「表格 → 远端查询与分页」可以体验图中的列表，或打开「布局实验室」调整工作台。

## 核心能力

### TablePro：从纯表格到业务列表

同一个 `RTablePro` 可以用 `bare` 只渲染表格，也可以接入搜索、分页和工具栏。列定义、行选择、排序和自定义单元格沿用 Naive UI DataTable 的写法。

- **查询和分页**：传入本地数据 `data`，或提供返回 `{ data, total }` 的 `request(params, signal)`。远端模式只接收最新请求的结果，失败时保留已有数据并提供重试。
- **长列表和列设置**：表格可填充工作区，配合虚拟滚动；用户可调整列的显示、顺序和固定位置，通过 `columnStateKey` 跨刷新记住隐藏列。
- **导出与打印**：默认导出和打印当前页的可见数据列。报表、单据等独立排版可指定自定义打印区域。

[TablePro 用法与数据契约](src/components/RTablePro/README.md)

### 应用外壳：适配不同的后台工作方式

侧栏、顶部、混合导航可切换，窄屏自动改用菜单抽屉。工作区支持定宽或铺满、顶栏与页脚固定、内容最大化；用户的布局偏好由 Pinia 保存。可以在布局实验室实时调试，也可以用具名插槽替换顶栏、侧栏、标签栏和页脚。

标签页可在多个页面之间切换，面包屑标示当前位置，用 `⌘/Ctrl + K` 可以查找菜单。全局提供明暗主题和中英文切换。

[布局实验室源码](src/views/demo/layout-demo.tsx) · [布局配置与插槽](src/layout/README.md)

### 路由模块：把页面、菜单与权限放在同一处配置

在 `src/router/modules` 声明页面，模板按路由配置生成菜单和面包屑。路由 `meta` 可以配置菜单文案与图标、角色、显示条件和 `keepAlive`。从列表进入详情时，可以保留当前菜单和标签页，只在面包屑中补充详情层级。角色配置同时用于菜单过滤和直接导航时的守卫。接入业务时，由后端校验会话与接口权限。

[路由与菜单约定](src/router/README.md) · [多级菜单与缓存示例](src/router/modules/demo/multi-menu.ts)

### 组件、Hooks 与图标：从可运行的示例里复用

- **组件**：`RForm` 和 `RModal` 用于表单和弹窗场景，`RChart` 封装 ECharts 实例的初始化、尺寸与主题同步；另有 LogicFlow 流程图、条形码和拖拽卡片示例。[组件入口与约定](src/components/README.md)
- **Hooks**：模板 Hooks 处理页面刷新、内容最大化、菜单标记和水印；Web Hooks 展示截图、打印和元素全屏。交互示例提供可展开的用法代码。[Hooks 示例](src/hooks/README.md)
- **SVG**：把文件放入 `src/icons` 的对应分包即可生成类型提示和雪碧图。路由和 `RIcon` 使用同一套完整名称，例如 `navigation/dashboard`，图标库可按分包查找并复制 TSX 用法。[图标生成与使用](src/icons/A_README.md)

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

## 工程结构

```text
.
├── src/
│   ├── main.ts              # 初始化应用、路由、状态和国际化
│   ├── App.tsx              # 根组件，挂载全局 Provider 与布局
│   ├── views/               # 登录页、工作台、业务页面和交互示例
│   │   └── demo/            # TablePro、布局实验室、Hooks 等示例
│   ├── router/
│   │   └── modules/         # 页面路由、菜单元数据与角色配置
│   ├── layout/              # 导航、标签页、面包屑与内容区
│   ├── components/          # 通用组件，统一从 @/components 导入
│   ├── app-components/      # 与应用状态绑定的组件和全局 Provider
│   ├── api/                 # 按业务组织的接口函数
│   ├── axios/               # 请求实例、拦截器与取消机制
│   ├── store/               # Pinia 状态模块与访问方法
│   ├── hooks/               # 模板、组件和 Web 相关的组合式函数
│   ├── app-config/          # 应用、路由、主题与语言配置
│   ├── locales/             # 中英文语言包与加载逻辑
│   ├── icons/               # 分包 SVG 源文件与生成清单
│   ├── styles/              # 全局样式、设计变量与主题覆盖
│   ├── directives/          # 全局指令
│   ├── types/               # 共享类型与声明
│   ├── utils/               # 通用工具函数
│   └── demo-data/           # Mock 和静态演示共用的样例数据
├── mock/                    # 开发环境 Mock 接口
├── public/                  # 构建时原样复制的静态资源
├── vite-helper/             # 图标、CDN 和 SEO 等构建辅助
├── vite.config.ts           # Vite 开发与构建入口
├── vite.custom.config.ts    # 部署路径、开发代理和构建选项
├── tsconfig.json            # 引用应用、Node 与测试的 TS 配置
├── package.json             # 依赖、运行时版本与项目命令
├── scripts/                 # 环境检查与图标生成
├── __test__/                # Vitest 测试与测试工具
├── harness/                 # 任务域说明、定向验证与报告生成
├── .github/workflows/       # CI 检查与 GitHub Pages 部署
└── docs/                    # 架构、设计与工程约定
```

模块之间的调用关系见[架构地图](docs/architecture.md)。

## 从示例改出第一个业务页面

下面是人员列表的最小接入。它使用仓库自带的 Mock 查询函数；换成订单或库存列表时，替换列定义、搜索字段与请求函数即可。

```tsx
import { getPersonList } from '@/api/demo/mock/person'
import { RTablePro } from '@/components'
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

1. **写页面**。在 `src/views` 新建页面，参考[远端查询示例](src/views/demo/tables/remote.tsx)加入排序、行选择和工具栏。
2. **接入导航**。在 `src/router/modules` 添加路由，给菜单配置中英文文案。页面需要缓存时，参考[路由约定](src/router/README.md)配置路由与组件名称。
3. **替换演示数据**。从 `src/api` 接入业务接口，通过 `src/axios` 统一处理拦截与取消，再接入实际登录和会话。人员列表示例在开发时走 Mock HTTP，静态预览使用本地样例数据。[请求层说明](src/axios/README.md)

## 检查、构建与部署

| 命令                          | 用途                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `pnpm test:run`               | 运行 Vitest 测试                                         |
| `pnpm check`                  | 执行 CI 同款检查，包含类型、Lint、格式、测试和生产构建   |
| `pnpm harness context`        | 按路由、UI、API 等任务域查找源码入口和验证命令           |
| `pnpm harness verify`         | 执行全量检查并保存本地报告，也可以指定任务域进行定向验证 |
| `pnpm build` / `pnpm preview` | 输出到 `dist/production`，或在本机预览构建               |

二次开发可从[架构地图](docs/architecture.md)定位配置与模块。部署到域名根目录或子路径、为公开站点启用搜索元数据时，参考[部署指南](docs/architecture.md#deployment-and-search-discovery)。人工和 AI 协作共用 [AGENTS.md](AGENTS.md) 与 [AI Harness](harness/README.md)。

[MIT 许可证](LICENSE) · [更新日志](CHANGELOG.md) · [问题反馈](https://github.com/XiaoDaiGua-Ray/ray-template/issues)
