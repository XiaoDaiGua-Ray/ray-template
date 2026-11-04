# Signing Store

`useSigningGetters().getSigningCallback` 返回账号信息引用。登录前可能为空对象，成功后主要字段为 `name`、`role`、`avatar?`。角色用于客户端路由判断，后端仍需对每次请求校验会话和权限。

| 方法                              | 行为                                                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `signing(form)`                   | 接收 `{ name, pwd }`。模板演示对非空表单返回固定的 `admin` 角色，不校验密码。成功解析为 `{ code: 0, data, message }`；空表单拒绝，包含 `code: 1` 和 `data: null`。 |
| `clearSigningCallback(toSigning)` | 清理当前应用登录和菜单缓存、Session Storage，并尝试关闭标签。`true` 时还会清路由、回到登录页并安排刷新。                                                           |
| `logout()`                        | 调用 `clearSigningCallback(true)`。                                                                                                                                |

登录演示页面在 `signing` 成功后写入演示 token 和签入信息；Store 的 `signing` 动作自身不签发 token。请求插件从 Local Storage 读取 token，Pinia 另外持久化 `signingCallback`。对接实际身份系统时，把 token 写入、角色刷新与退出清理视为同一条流程。

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
