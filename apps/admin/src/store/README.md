## Purpose

> Pinia owns all globally mutable UI state, grouped by responsibility. `src/store/hooks` exposes reactive getters and actions.

## Constraints

- Group stores by responsibility, using names that make their purpose clear.
- Name each directory after its responsibility. Use index.ts as the default entry point and keep helpers/types in the same directory, such as type.ts and helper.ts.
- The repository uses `piniaPluginPersistedstate` to retain store data across reloads; it cannot persist functions.
- State is not persisted wholesale by default. Enable the needed fields through `persist` in the third `defineStore` argument.
- The first `defineStore` argument must be globally unique.
- Name persistence keys `piniaXXXStore`, where XXX is the store name.

```ts
export const piniaDemoStore = defineStore(
  'demo',
  () => {
    const demoRef = ref('hello')

    const updateDemoRef = (str: string) => (demoRef.value = str)

    return {
      demoRef,
      updateDemoRef,
    }
  },
  {
    persist: {
      key: 'piniaDemoStore',
      pick: ['demoRef'],
      storage: localStorage,
    },
  },
)
```

Register corresponding getters and actions:

```ts
// piniaDemoStore
import piniaDemoStore from '../index'

export const useDemoGetters = () => {
  const variable = piniaDemoStore()

  const getDemoRef = computed(() => variable.demoRef)

  return {
    getDemoRef,
  }
}

export const useMenuActions = () => {
  const { updateDemoRef } = piniaDemoStore()

  return {
    updateDemoRef,
  }
}
```

Expose them from index.ts:

```ts
export { useDemoGetters, useMenuActions } from './modules/demo'
```

Usage:

```ts
import { useDemoGetters, useMenuActions } from '@/store'
```

## Runtime state and layout preferences

- `runtime`: Global loading, mobile drawers, page refresh, content maximization, and content loading animations. Read/write through `useRuntimeGetters` / `useRuntimeActions`. Do not persist it; release the store and timers on application unmount.
- `lock-screen`: Lock-screen state also belongs to Pinia. Preserve its historical boolean format, cache key, and cross-tab synchronization.
- `setting.layoutConfig`: Layout mode, content width/spacing, and header/footer positioning. Use existing `useSettingGetters` / `useSettingActions` and the existing settings cache key. Add defaults to old caches without clearing historical preferences.
- The separate `global-variable` module was removed. Its original five state names remain in runtime; callers use store hooks. Add global state by responsibility in `src/store/modules`, rather than creating shared reactive singletons in ordinary modules.

```ts
import { useRuntimeActions, useRuntimeGetters } from '@/store'

const { globalSpinning } = useRuntimeGetters()
const { setRuntimeState } = useRuntimeActions()
setRuntimeState('globalSpinning', true)
// 异步任务结束后，务必恢复加载状态。
setRuntimeState('globalSpinning', false)
```

See the [layout guide](../layout/README.md) for usage and slots.

## Menu synchronization

- Build menu trees and path indexes when roles change or during explicit refresh. Do not mutate original module routes. After navigation, synchronize tabs and breadcrumbs from Vue Router's matched records.
- Preserve existing cache keys and tab-list structure. Restore historical tabs using registered routes and roles, ignoring deleted or inaccessible routes. Write the session cache only when the tab list changes.
- Update KeepAlive in recent-access order, deduplicate, and trim to its limit. Merge themes only when the effective theme changes; observe color-weakness mode and document titles independently.

## Recent navigation and favorites

Expose `navigation-history` through `useNavigationHistoryGetters` / `useNavigationHistoryActions`. Isolate Local Storage by session user id. Store up to 10 deduplicated recent menu paths and favorite paths, without search terms, titles, URL query parameters, or page data. Resolve display/navigation against currently visible menus; omit revoked, hidden, or deleted paths. Account switching immediately clears the in-memory view and reads the matching cache. Clearing history does not remove favorites.
