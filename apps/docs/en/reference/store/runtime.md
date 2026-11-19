# Runtime and Lock Screen Stores {#runtime-与-lock-screen-store}

## Runtime Store

`useRuntimeGetters()` exposes read-only refs. `useRuntimeActions()` returns `setRuntimeState(key, value)` and `reloadContent(wait = 800, path?)`. These UI values live in memory.

| Field                          | Default           | Purpose                                                                           |
| ------------------------------ | ----------------- | --------------------------------------------------------------------------------- |
| `globalSpinning`               | `false`           | Global spinner.                                                                   |
| `globalDrawerValue`            | `false`           | Narrow-screen menu drawer.                                                        |
| `globalMainLayoutLoad`         | `true`            | Whether the default layout mounts page content.                                   |
| `refreshingPath`               | `null`            | Full address of the page being refreshed.                                         |
| `layoutContentMaximize`        | `false`           | Workspace maximization.                                                           |
| `layoutContentMaximizeVersion` | `0`               | Sequence number used to discard stale maximization callbacks. Managed internally. |
| `layoutContentSpinning`        | `false`           | Layout content spinner.                                                           |
| `layoutContentMaximizeStyle`   | `{ zIndex: 999 }` | Maximized stacking order, background, and transition.                             |

Call `reloadContent` with the current full path to remount that page. Omit the path to release all cached content instances. Only the newest timer is retained, and disposal clears it. Pages can call `useSpinning().reload()` for the active page or `reloadWorkspace()` for the full workspace. Use [useMaximize](../hooks/layout#usemaximize) to retain callbacks and exit handling. Global and content loading are independent.

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

Global loading state is Boolean. Coordinate several concurrent requests in the caller before toggling it.

## Lock Screen Store

`useLockScreenGetters().getLocked` reads the actual lock state. `useLockScreenActions().setLocked(value)` writes it. It defaults to `false` and uses the legacy Local Storage Boolean key `isAppLockScreen` with cross-tab sync.

`setting.lockScreenSwitch` controls the lock configuration dialog. The default lock component handles the local passphrase and unlock flow. A business action should open the configuration dialog so the user can set a passphrase before locking. The lock screen hides the local interface independently of server sessions and authorization.

[Runtime implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/runtime/index.ts) · [Lock Screen implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/lock-screen/index.ts) · [Lock flow](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/app-components/app/AppLockScreen/components/LockScreen/index.tsx)
