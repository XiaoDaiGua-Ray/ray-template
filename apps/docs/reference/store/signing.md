# Signing Store

`useSigningGetters().getSigningCallback` 返回会话用户资料，主要字段为 `id`、`username`、`name`、`role`、`avatar?`。`getPermissions` 返回当前会话的权限码；前端菜单与操作分别消费角色和权限，后端独立检查业务请求。

| 方法                     | 行为                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `signing({ name, pwd })` | 登录成功后将资料和权限写入 Store，返回 `Promise<void>`。调用方通过 getters 读取资料。失败时 Promise 拒绝。 |
| `restoreSession()`       | 从会话接口恢复资料与权限。收到 401 时清理失效会话，其他请求错误向调用方抛出。                              |
| `clearSigningCallback()` | 清理当前应用的登录和路由状态、锁屏信息及菜单标签缓存，保留当前地址。                                       |
| `endSession(redirect?)`  | 清理本地会话，通知其他标签页，并导航到登录页。可选参数用于下次登录后返回原页。                             |
| `logout(redirect?)`      | 请求服务端注销。成功或收到 401 后执行 `endSession`，其他请求错误向调用方抛出。                             |

用户资料和权限保存在内存。刷新后由会话接口重新取得。Bearer 模式将访问令牌存入当前应用的本地存储，Cookie 模式由浏览器管理会话凭据。搜索收藏和最近访问按账号隔离。接口定义见[服务端契约](../../guide/backend)。

```ts
import { useSigningActions, useSigningGetters } from '@/store'
import { computed } from 'vue'

export function useAccountMenu() {
  const { getSigningCallback } = useSigningGetters()
  const { logout } = useSigningActions()
  return { name: computed(() => getSigningCallback.value?.name ?? ''), logout }
}
```

退出只移除本应用使用的会话和缓存键。同一来源中其他业务的 Session Storage 条目会保留。

[Signing 实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/signing/index.ts) · [类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/signing/types.ts) · [演示登录](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/login/components/Signing/index.tsx) · [权限守卫](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/utils/permission.ts)
