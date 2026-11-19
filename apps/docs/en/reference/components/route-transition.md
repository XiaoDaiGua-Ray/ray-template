# RTransitionComponent

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RTransitionComponent` is the template route outlet. It composes `RouterView`, `Transition`, `Suspense`, and `KeepAlive`. It renders the matched component and keys instances by `route.fullPath`, so query and hash changes can also select another instance.

| Prop                 | Default    | Description                                                  |
| -------------------- | ---------- | ------------------------------------------------------------ |
| `transitionPropName` | `'fade'`   | Vue Transition class prefix. Match the application's styles. |
| `transitionMode`     | `'out-in'` | Vue Transition mode.                                         |
| `transitionAppear`   | `true`     | Runs the transition on the first mount.                      |

`setting.keepAliveConfig` controls global enablement, capacity, and excluded names. `KeepAlive.include` comes from the KeepAlive Store. To enter the cache, a page's component name must match its route name. The allowlist is saved in the tab's Session Storage. A browser refresh still creates new component instances. In a custom layout slot, render one outlet at the intended route level to avoid double rendering. Transitioned pages use a single root element.

## Interactive example {#交互示例}

<AdminExample path="/multi/multi-menu-one" title="Route transitions and page caching" layout />

::: details View example source
<<< @/../admin/src/views/demo/multi/views/multi-menu-one/index.tsx
:::

```tsx
import { RTransitionComponent } from '@/components'

export const renderPageOutlet = () => (
  <RTransitionComponent transitionPropName="fade" transitionAppear={false} />
)
```

[Component source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/admin-shell/src/RouteTransition.vue) · [Cache Store](../store/navigation#keepalive-store) · [Troubleshoot KeepAlive](../../guide/routing#keepalive-排查)
