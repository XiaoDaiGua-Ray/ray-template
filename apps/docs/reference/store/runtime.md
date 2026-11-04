# Runtime 与 Lock Screen Store

## Runtime Store

`useRuntimeGetters()` 提供只读 ref；`useRuntimeActions()` 返回 `setRuntimeState(key, value)`、`reloadContent(wait = 800)`。这些 UI 状态不持久化。

| 字段                           | 默认              | 用途                                                       |
| ------------------------------ | ----------------- | ---------------------------------------------------------- |
| `globalSpinning`               | `false`           | 全局 Spin。                                                |
| `globalDrawerValue`            | `false`           | 窄屏菜单抽屉。                                             |
| `globalMainLayoutLoad`         | `true`            | 默认布局是否挂载页面内容。                                 |
| `layoutContentMaximize`        | `false`           | 工作区最大化。                                             |
| `layoutContentMaximizeVersion` | `0`               | 最大化状态变动序号，用于过滤过期回调，业务代码不直接更新。 |
| `layoutContentSpinning`        | `false`           | 布局内容区 Spin。                                          |
| `layoutContentMaximizeStyle`   | `{ zIndex: 999 }` | 最大化的层级、背景、过渡样式。                             |

`reloadContent` 暂时卸载当前内容并等待恢复；多次调用只保留最后一个计时，Store 卸载时清理计时。`useSpinning().reload()` 是同一动作。控制最大化时用 [useMaximize](../hooks/layout#usemaximize) 来保留回调和退出逻辑。全局 Spin 和内容 Spin 互相独立。

```ts
import { useRuntimeActions } from '@/store'

export function useGlobalLoading() {
  const { setRuntimeState } = useRuntimeActions()
  return async <T>(task: () => Promise<T>) => {
    setRuntimeState('globalSpinning', true)
    try {
      return await task()
    } finally {
      setRuntimeState('globalSpinning', false)
    }
  }
}
```

全局状态是布尔值，不对并发任务计数。如果多个独立请求同时使用，先由调用方统一协调开关。

## Lock Screen Store

`useLockScreenGetters().getLocked` 是实际锁屏状态。`useLockScreenActions().setLocked(value)` 写入同一个状态，默认 `false`，通过 `isAppLockScreen` 在 Local Storage 保存历史布尔格式并跨标签同步。

实际锁定与 `setting.lockScreenSwitch` 分开，后者只控制锁屏设置弹窗。默认锁屏组件处理本地口令和解锁逻辑；业务按钮应打开设置弹窗，直接写锁定布尔值不会为用户建立口令。它是本机界面遮挡，与服务端会话和授权独立。

[Runtime 实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/runtime/index.ts) · [Lock Screen 实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/lock-screen/index.ts) · [锁屏流程](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/app-components/app/AppLockScreen/components/LockScreen/index.tsx)
