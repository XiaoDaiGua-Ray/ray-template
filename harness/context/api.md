# API、请求与 Mock

用于新增接口、调试 Axios 响应和拦截器、定位重复请求或切页取消、修改演示数据。先看[请求契约](../../apps/admin/src/axios/README.md)。

| 要查什么                        | 先读                                                                                                                                                             | 接着追踪                                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 业务接口、分页数据、请求配置    | [应用 API](../../apps/admin/src/api)、[应用请求实例](../../apps/admin/src/axios/instance.ts)、[请求配置](../../apps/admin/src/app-config/request-config.ts)      | [人员接口调用](../../apps/admin/src/api/demo/mock/person.ts)、[接入指南](../../apps/docs/guide/requests.md)                                                         |
| Axios 拦截器、异常和客户端隔离  | [共享客户端](../../packages/http/src/client.ts)、[共享类型](../../packages/http/src/types.ts)                                                                    | [应用请求拦截器](../../apps/admin/src/axios/axios-interceptor/request/provider.ts)、[响应拦截器](../../apps/admin/src/axios/axios-interceptor/response/provider.ts) |
| 重复请求、AbortSignal、切页取消 | [共享 RequestCanceler](../../packages/http/src/RequestCanceler.ts)、[应用取消 Provider](../../apps/admin/src/app-components/provider/AppRequestCancelerProvider) | [布局内容插槽](../../apps/admin/src/layout/default/ContentWrapper/index.tsx)、[TablePro 远端请求](table-pro.md)                                                     |
| 开发 Mock 与静态演示不同        | [开发 Mock](../../apps/admin/mock/demo/person.mock.ts)、[共用演示数据](../../apps/admin/src/demo-data/people.ts)                                                 | [应用调用的环境分支](../../apps/admin/src/api/demo/mock/person.ts)、[Vite Mock 插件](../../vite.plugin.config.ts)                                                   |

应用 `axios/utils` 中有兼容转导出。请求的默认 signal 只在调用方未传 signal、且未禁用默认取消时注入。演示数据不代表生产接口或授权；前端 `VITE_*` 配置不可用于密钥。

定向验证：`pnpm harness verify api`，包括[应用请求](../../__test__/axios/request.spec.ts)、[客户端隔离](../../__test__/workspace/http-client.spec.ts)和 [Mock](../../__test__/mock/database.spec.ts)。生产后端接入、浏览器下载和真实链路需另验。
