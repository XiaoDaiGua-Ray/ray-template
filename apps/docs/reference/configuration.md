# 应用配置

应用配置与站外文档配置分属两个仓库。这里说明 Ray Template 应用中的 `@/app-config`、Vite 配置和运行期设置。运行期保存的用户偏好可能覆盖源码默认值，验证默认设置时使用干净的浏览器存储。

| 文件                                          | 配置                                                                                                                                                                                                                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/admin/src/app-config/app-config.ts`     | `GLOBAL_CLASS_NAMES`（明暗类与 CSS 变量）、`MESSAGE_PROVIDER`（上下文消息，默认最多 5 条、不可关闭）、`LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE`（默认关）、`APP_GLOBAL_LOADING`、`PRE_LOADING_CONFIG`、`APP_CATCH_KEY` / `APP_CATCH_KEY_PREFIX`、`CONTENT_TRANSITION_OPTIONS`。 |
| `apps/admin/src/app-config/design-config.ts`  | `APP_THEME` 的候选色、构建品牌蓝 `#3b63d9`、现代化预设的明暗覆盖、ECharts 默认主题。四套预设在 `packages/ui/src/theme-presets.ts`。                                                                                                                                           |
| `apps/admin/src/app-config/local-config.ts`   | `LOCAL_OPTIONS`、`SYSTEM_DEFAULT_LOCAL`、`SYSTEM_FALLBACK_LOCALE`、`DAYJS_LOCAL_MAP`、`DEFAULT_DAYJS_LOCAL`。默认与回退语言为 `zh-CN`。                                                                                                                                       |
| `apps/admin/src/app-config/request-config.ts` | `AXIOS_CONFIG`。默认同源相对地址、5 秒超时、`withCredentials: false`、JSON Content-Type。                                                                                                                                                                                     |
| `apps/admin/src/app-config/router-config.ts`  | `SETUP_ROUTER_ACTION`（加载条与守卫默认开）、`WHITE_ROUTES`（路由名白名单）、`SUPER_ADMIN`（默认空）、`LAYOUT_CONTENT_REF` / `LAYOUT_SIDER_REF`。                                                                                                                             |
| `apps/admin/src/app-config/regex-config.ts`   | `APP_REGEX`，模板 CSS 尺寸规则。                                                                                                                                                                                                                                              |
| `vite.custom.config.ts`                       | `base`、`server`、`buildOptions(mode)`、`alias`、`cdn`、`copyright`、Sass 注入和首屏加载配置。                                                                                                                                                                                |

## 选择改动入口

- 修改默认用户偏好（布局、菜单、标签、缓存）时看 [Setting Store](./store/setting) 与 `apps/admin/src/store/modules/setting/constant.ts`。已有用户可在应用设置里恢复默认后检查效果。
- 修改主题或语言时看[主题和国际化](../guide/appearance)。新增语言同时维护翻译资源与 Day.js、Naive UI 对应关系。
- 修改访问控制时看[路由指南](../guide/routing)。白名单按区分大小写的字符串路由名判断，守卫先处理 token，再按白名单和角色处理导航。
- 修改 API 地址、认证头和失败策略时看[接口与 Mock](../guide/requests)。应用不会自动把任意 `VITE_*` 环境变量绑定到 Axios；需在配置中明确读取。
- 应用默认部署子路径 `/ray-template/`。部署子路径改变后重新构建并验证图标、代理和直达链接，见[工程与部署](../guide/tooling)。

`__APP_CFG__` 由 Vite 在构建时注入，用于应用包信息、版权与默认主色。任何注入到客户端的字段都可被浏览器读取。用于页面交互的运行态偏好走 Store，构建参数留在 Vite 配置。

[应用配置源码](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/apps/admin/src/app-config) · [Vite 自定义配置](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/vite.custom.config.ts)
