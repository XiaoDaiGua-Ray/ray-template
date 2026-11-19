# App Components and Providers {#应用组件与-provider}

Use default imports by file, for example `import AppPageHeader from '@/app-components/app/AppPageHeader'`. These components depend on application stores, routing, or the DOM. Integrate them in the [default App mount order](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/App.tsx).

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

## Admin context example {#后台上下文示例}

This preview runs the admin dashboard and layout. Use the Template Hooks entry in the sidebar to change the theme, watermark, layout loading state, and menu state. Version prompts, request cancellation, and other providers belong to application initialization.

<AdminExample path="/dashboard" title="Admin dashboard, layout, and providers" layout />

::: details View the preview entry point and dashboard source
<<< @/../admin/src/documentation-example.tsx
<<< @/../admin/src/views/dashboard/index.tsx
:::

## Page components {#页面组件}

| Component       | Configuration and behavior                                                                                                                                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppPageHeader` | `title` is required. `description` defaults to empty, and `eyebrow` defaults to `RAY TEMPLATE`. Place action buttons in the default slot on the right and page content outside the component.                                                                                 |
| `AppShareLink`  | `variant: 'compact' \| 'cards'` defaults to `compact`. Text comes from the dashboard messages. The component defines its own links.                                                                                                                                           |
| `AppAvatar`     | Reads avatar and name from Signing Store. `avatarSize` and `spaceSize` default to `medium`, and `vertical` defaults to `false`. Avatars are round and use cover sizing. The first character of the name is the fallback. Internally derived `src` and `size` take precedence. |
| `AppGlobalSpin` | Accepts NSpin props and slots. Runtime Store's `globalSpinning` controls visibility and overrides `show`. The layout content spinner is independent.                                                                                                                          |
| `AppLockScreen` | `setting.lockScreenSwitch` controls the setup dialog. The dialog stays open on backdrop clicks and Esc. After locking, the layout reads Lock Screen Store to render the unlock screen.                                                                                        |

```tsx
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { NButton } from 'naive-ui'

export const renderOrdersHeader = (create: () => void) => (
  <AppPageHeader
    eyebrow="Inventory"
    title="Orders"
    description="View and manage sales orders"
  >
    <NButton type="primary" onClick={create}>
      New order
    </NButton>
  </AppPageHeader>
)
```

## Providers {#provider}

| Provider                     | Responsibilities and lifecycle                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppNaiveGlobalProvider`     | Wraps the default slot and syncs color mode, theme overrides, UI locale, and date locale. Provides Message, Dialog, Modal, Notification, and LoadingBar contexts and assigns `window.$message`, `$dialog`, `$notification`, and `$loadingBar`. Discrete APIs are available after initialization and released on unmount. Call them after the provider is ready. |
| `AppStyleProvider`           | Syncs HTML color-mode classes, CSS primary color, and viewport variables, and ends the startup animation. Use settings actions to change the theme.                                                                                                                                                                                                             |
| `AppVersionProvider`         | Compares the built version with the cached version at startup. The first startup writes the version. On version change, confirming the prompt signs out and reloads, and canceling closes the prompt.                                                                                                                                                           |
| `AppWatermarkProvider`       | Renders a full-page Naive UI watermark from preferences. Standalone pages can place `NWatermark` in a local region.                                                                                                                                                                                                                                             |
| `AppRequestCancelerProvider` | Cancels template-managed requests from the route update hook in the default content area. Preserve cancellation as needed when replacing the content slot.                                                                                                                                                                                                      |

[App components](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/app-components/README.md) · [Layout settings](../../guide/layout) · [Stores](../store) · [Request cancellation](../../guide/requests)
