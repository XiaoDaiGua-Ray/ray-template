# @ray-template/api-contracts

后台业务与演示接口共用的 TypeScript 类型、Valibot Schema 和 OpenAPI 3.1 定义。包不读取 DOM、Storage 或 Mock 数据，不依赖后台应用别名，可由前端、Mock 和自有服务端共同使用。

| 入口                                  | 内容                                             |
| ------------------------------------- | ------------------------------------------------ |
| `@ray-template/api-contracts`         | 全部请求/响应类型和 Schema                       |
| `@ray-template/api-contracts/admin`   | 登录、会话、用户、权限和统一响应包络             |
| `@ray-template/api-contracts/demo`    | 人员、订单、搜索选项、图表、请求及路由示例       |
| `@ray-template/api-contracts/openapi` | `getAdminOpenApi()`，包含路由契约的 OpenAPI 文档 |

```ts
import { userInputSchema } from '@ray-template/api-contracts/admin'
import type { ApiResponse, UserInput } from '@ray-template/api-contracts/admin'
import * as v from 'valibot'

const input: UserInput = v.parse(userInputSchema, requestBody)
```

HTTP 成功响应为 `ApiResponse<T>`，分页数据为 `{ items, total }`。失败同时使用对应的 HTTP 状态和 `code`，并返回 `data: null` 与稳定的 `error.key`。查询参数通过 HTTP 编码后，服务端应先将分页数字、`refresh` 与演示用 `fail` 转成对应基础类型，再使用 Schema 验证。

修改 Schema 后运行根目录的 `pnpm api:generate` 更新应用和文档的可下载契约；`pnpm api:check` 检查同步。应用的旧 `api/admin/contracts`、`api/demo/contracts` 和 `api/admin/openapi` 路径保留为兼容转导出。

包是仓库内的 workspace 包，尚未发布到 npm。对接步骤与部署要求见[服务端接入指南](../../apps/docs/guide/backend.md)。
