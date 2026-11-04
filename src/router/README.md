# 路由、菜单与权限

## 切换路由来源

登录后，从侧栏打开 **路由管理**（`/#/route-management`）。管理页由应用外壳注册，并使用 `admin` 角色守卫。可快速添加页面、编辑完整 JSON、从文件导入、校验和预览配置树，也可导出 JSON、标准 JSON Schema 和可用页面清单。

| 来源      | 读取行为                                     | 应用方式                                   |
| --------- | -------------------------------------------- | ------------------------------------------ |
| 静态路由  | 读取 [modules](modules) 下的 TypeScript 模块 | 选择静态路由并应用                         |
| 本机 JSON | 读取当前浏览器保存的配置                     | 导入文件或编辑 JSON，校验后应用            |
| 后端接口  | 启动时请求部署配置 `VITE_ROUTE_CONFIG_URL`   | 选择后端接口并应用。接口地址随前端部署配置 |

应用时重新加载页面，重新生成路由匹配、菜单和标签页。设置接口地址时，新浏览器默认选择后端接口。显式选择的来源保存在当前浏览器。接口异常、超时或配置校验失败时恢复静态路由，管理页显示失败原因。登录、管理页、404 由外壳保留。未配置 `/dashboard` 时补充内置首页。

## 后端与 AI 契约

部署时提供 `VITE_ROUTE_CONFIG_URL=/api/route-config`，或使用启用 CORS 的 HTTPS 地址。客户端请求 `GET`，接受 `application/json`，超时 5 秒。同源请求可用会话 Cookie。接口直接返回下方 JSON，导入、导出和接口响应使用同一结构。

```json
{
  "version": 1,
  "routes": [
    {
      "path": "/reports",
      "component": "layout",
      "meta": { "noLocalTitle": "Reports", "role": ["admin"], "order": 20 },
      "children": [
        {
          "path": "overview",
          "name": "REchart",
          "component": "demo/echart",
          "meta": {
            "i18nKey": "menu.Echart",
            "icon": "navigation/echart",
            "keepAlive": true
          }
        }
      ]
    }
  ]
}
```

| 字段                                                                            | 规则                                                                                                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `path`、`children`                                                              | 相对路径拼接到父组，绝对路径从根匹配。支持普通命名参数及可选参数，参数路由需设置 `hidden` 或 `sameLevel`。分组只参与菜单与权限 |
| `name`、`component`                                                             | 名称唯一。页面只能引用 [注册表](config/views.ts) 中的 ID。开启 `keepAlive` 时名称与该页面组件名一致                            |
| `alias`、`redirect`                                                             | 支持叶子页的绝对别名和指向已配置页面的站内重定向。重定向的直接访问使用目标页权限                                               |
| `props`                                                                         | `true` 将路由参数传给页面，也可传入 JSON 对象                                                                                  |
| `meta.i18nKey`、`meta.noLocalTitle`、`meta.icon`、`meta.extra`                  | 翻译键优先于字面标题。图标使用 [IconName](../icons/manifest.ts)。标签可配置文案、翻译键、颜色、显隐及图标                      |
| `meta.role`、`meta.hidden`、`meta.env`、`meta.sameLevel`                        | 父组和叶子的角色限制同时生效。隐藏、环境和平级模式影响菜单。平级模式在当前标签下追加面包屑                                     |
| `meta.keepAlive`、`meta.ignoreAutoResetScroll`、`meta.order`、`meta.windowOpen` | 控制叶子页缓存、滚动复位、顶层排序和 HTTP(S) 外部链接                                                                          |

[JSON Schema](config/schema.ts) 描述字段，Valibot 从同一份定义推导类型并校验结构，导出时使用官方转换器生成 JSON Schema。[校验与转换](config/contract.ts) 额外验证页面 ID、图标、参数冲突、保留地址和重定向环。最多 300 个记录、8 层、256 KiB。函数、VNode、路由钩子等代码能力使用 TypeScript 模块。路由角色控制前端菜单与导航，后端仍需验证业务 API 权限。

仓库内可直接导出 Schema 给后端或 AI 使用。

```sh
node --input-type=module -e "import {getRouteJsonSchema} from './src/router/config/json-schema.ts'; console.log(JSON.stringify(getRouteJsonSchema(), null, 2))"
```

## 扩展静态页面

新增页面时先在 [页面注册表](config/views.ts) 注册稳定 ID 和组件名，再从 `src/router/modules` 的路由记录用 `routeView(id)` 引用。静态模块默认导出一条记录。分组可以使用 `LAYOUT` 和 `children`，叶子在同一个应用布局中渲染。简体中文和英文菜单文案分别写入两份 `menu.json`。

系统配置和白名单见 [router-config.ts](../app-config/router-config.ts)。在 Vue setup 之外读取路由器时使用 `useVueRouter()`。变更后运行 `pnpm harness verify routing`，并核对菜单跳转、直达、刷新、切换来源、角色和缓存。
