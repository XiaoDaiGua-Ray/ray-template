# RIframe

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RIframe` wraps a native iframe and Naive UI Spin. Embed pages that permit it. The embedded page's CSP, framing permissions, and same-origin policy still apply. The `load` event signals a frame load. Verify business content separately where needed.

## Interactive example {#交互示例}

<AdminExample path="/iframe" title="Embedded page and loading state" />

::: details View example source
<<< @/../admin/src/views/demo/iframe/index.tsx
:::

```tsx
import { RIframe } from '@/components'

export const renderReport = (url: string) => (
  <RIframe src={url} title="Inventory report" height={460} lazy="eager" />
)
```

| Prop                                 | Default  | Description                                                                    |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| `src`                                | Required | iframe URL. If it comes from user input, enforce application-approved origins. |
| `width` / `height`                   | `'100%'` | CSS dimensions. Percentage heights depend on the parent.                       |
| `frameborder`                        | `0`      | Template border style value.                                                   |
| `iframeWrapperClass` / `iframeClass` | None     | Classes for the wrapper and native iframe.                                     |
| `title` / `name` / `allow`           | None     | Native iframe attributes. Provide `title` for assistive technology.            |
| `lazy`                               | `true`   | `true` or `'lazy'` defers loading. `false` or `'eager'` loads eagerly.         |
| `customSpinProps`                    | `{}`     | NSpin configuration. Internal state controls `show`.                           |

`onSuccess(iframe, event)` and `onError(event)` accept a callback or array. Each `src` change shows the spinner until `load` or `error`. The component ref exposes the native element as `iframe` and its compatibility alias `iframeInst`, both `null` before mounting. Vue already unwraps them. Additional slots go to Spin, and the iframe remains the default content.

[Component implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIframe/src/Iframe.tsx) · [Props](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RIframe/src/props.ts)
