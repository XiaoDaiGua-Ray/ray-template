# Signing Store

`useSigningGetters().getSigningCallback` 返回会话用户资料，主要字段为 `id`、`username`、`name`、`role`、`avatar?`。`getPermissions` 返回当前会话的权限码；前端菜单与操作分别消费角色和权限，后端独立检查业务请求。

| 方法                              | 行为                                                                                                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `signing({ name, pwd })`          | 调用标准登录接口，保存返回的 token、资料与权限。为兼容组件调用，动作成功仍返回 `{ code: 0, data, message }`；错误拒绝。HTTP 接口本身使用标准 `{ code: 200, msg, data }` 包络。 |
| `restoreSession()`                | 启动时重新读取用户资料与权限，401 清除失效会话；网络或协议错误拒绝，不沿用旧权限。                                                                                             |
| `clearSigningCallback(toSigning)` | 清理当前应用登录、菜单与 Session Storage，关闭标签；`true` 时回登录页并刷新。                                                                                                  |
| `logout()`                        | 先请求服务端注销，再清理本地会话。                                                                                                                                             |

Pinia 仅持久化用户资料；权限由会话接口刷新。搜索收藏和最近访问按稳定用户 id 隔离，旧的演示资料没有 id 时才使用名称。接口输入、输出和真实后端接入见[服务端契约](../../guide/backend)。

```ts
import { useSigningActions, useSigningGetters } from '@/store'
import { computed } from 'vue'

export function useAccountMenu() {
  const { getSigningCallback } = useSigningGetters()
  const { logout } = useSigningActions()
  return { name: computed(() => getSigningCallback.value?.name ?? ''), logout }
}
```

退出会清理当前来源的 Session Storage。多个业务共用同一来源时，接入方应明确其清理范围。动作还依赖已经挂载的消息 Provider 和 Router；从用户操作或已初始化的应用流程触发。

[Signing 实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/signing/index.ts) · [类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/signing/types.ts) · [演示登录](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/login/components/Signing/index.tsx) · [权限守卫](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/utils/permission.ts)
