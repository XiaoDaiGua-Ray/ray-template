# Signing Store

`useSigningGetters().getSigningCallback` returns the current user, with fields such as `id`, `username`, `name`, `role`, and optional `avatar`. `getPermissions` returns the session's permission codes. Frontend menus and actions use roles and permissions, and the backend independently authorizes business requests.

| Method                   | Behavior                                                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `signing({ name, pwd })` | Stores the user and permissions after sign-in and returns `Promise<void>`. Read the profile with getters. The promise rejects on failure. |
| `restoreSession()`       | Restores profile and permissions from the session endpoint. A 401 clears the invalid session. Other request errors reach the caller.      |
| `clearSigningCallback()` | Clears this app's sign-in and route state, lock state, and cached tabs while keeping the current address.                                 |
| `endSession(redirect?)`  | Clears the local session, notifies other tabs, and opens sign-in. The optional redirect can restore the destination at the next sign-in.  |
| `logout(redirect?)`      | Calls the server's logout endpoint. Success or 401 calls `endSession`. Other errors reach the caller.                                     |

The user profile and permissions live in memory and are retrieved from the session API after refresh. Bearer mode stores the access token in application Local Storage. In cookie mode the browser manages the session credential. Favorites and recent pages are scoped to the account. [Backend contract](../../guide/backend)

```ts
import { useSigningActions, useSigningGetters } from '@/store'
import { computed } from 'vue'

export function useAccountMenu() {
  const { getSigningCallback } = useSigningGetters()
  const { logout } = useSigningActions()
  return { name: computed(() => getSigningCallback.value?.name ?? ''), logout }
}
```

Sign-out removes only this application's session and cache keys. Other application entries in Session Storage on the same origin are retained.

[Signing implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/signing/index.ts) · [Types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/signing/types.ts) · [Sign-in demo](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/login/components/Signing/index.tsx) · [Route guard](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/router/utils/permission.ts)
