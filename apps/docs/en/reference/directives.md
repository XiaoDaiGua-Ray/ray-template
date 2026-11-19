# Directives {#指令}

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
import DebounceDemo from '../../examples/DebounceDemo.vue'
</script>

`main.ts` calls `setupDirectives(app)`. The registrar finds `packages/directives/src/modules/<name>/index.ts`, calls its default factory, and registers the returned Vue directive under the directory name. Use `v-<name>` directly in an SFC. The implementation files define each directive's binding type.

## Interactive example {#交互示例}

Try copy, throttle, debounce, ellipsis, ripple, and disabled behavior in one example. The smaller debounce example below shows the call count.

<AdminExample path="/directive" title="Six directives in one interactive example" :height="550" />

::: details View the full directives example source
<<< @/../admin/src/views/demo/directive/index.tsx
:::

## v-copy

Bind the string to copy. Changing the binding recreates the ClipboardJS instance, and unmounting destroys it. Ray Admin supplies notifications when registering the directive. Standalone consumers of `createCopyDirective` can supply their own callbacks. Trigger copy from a user click. Convert nonstring values such as numbers explicitly.

```vue
<template>
  <button type="button" v-copy="'ORD-001'">Copy order number</button>
</template>
```

[Source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/copy/index.ts)

## v-debounce and v-throttle {#v-debounce-与-v-throttle}

Click the button repeatedly. Debounce calls the handler once after 500 ms without further clicks.

<DebounceDemo />

::: details View example source
<<< @/examples/DebounceDemo.vue
:::

Both directives accept `{ func, trigger?, wait?, options? }`. `func` must be a function and can accept the native event. `trigger` defaults to `'click'`, `wait` to 500 ms, and `options` passes through to the corresponding Lodash method. Debounce handles input after a burst stops. Throttle limits a continuing event rate.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const requestedKeyword = ref('')
const clicks = ref(0)

const applySearch = () => {
  requestedKeyword.value = keyword.value
}
const countClick = () => {
  clicks.value += 1
}
</script>

<template>
  <input
    v-model="keyword"
    v-debounce="{ func: applySearch, trigger: 'input', wait: 300 }"
  />
  <p>Submitted query: {{ requestedKeyword }}</p>
  <button type="button" v-throttle="{ func: countClick, wait: 1000 }">
    Clicks: {{ clicks }}
  </button>
</template>
```

- `options.leading` and `trailing` control execution at the start and end of the interval. Debounce also supports `maxWait`. The directive reads the binding on mount. For changing data, read reactive values inside the original callback.
- Each bound element has independent timing. Unmounting removes its own listener and queued callback. Change the element's `key` to bind a new interval.
- These directives control how often handlers fire. Manage cancellation, concurrency, and idempotency separately for async requests.

[Debounce source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/debounce/index.ts) · [Throttle source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/throttle/index.ts)

## v-ellipsis

`width` is required. Numbers are pixels and strings can be CSS lengths. `type: 'block'` truncates one line. `type: 'line'` uses the `line` count, with one line as the default. `popoverText: true` writes the current text to the native `title`. Styles are written on mount and update. Switching modes or disabling hover text can leave the previous styles or `title`. For frequent changes, use the UI library's ellipsis component or change the node's `key`.

```vue
<template>
  <p v-ellipsis="{ type: 'line', line: 2, width: 240, popoverText: true }">
    Longer explanatory text is truncated after two lines.
  </p>
</template>
```

[Source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/ellipsis/index.ts)

## v-ripple

Omit the binding or pass `true` to enable, and use `false` to disable. Supply `{ class: '...' }` to style the ripple. `.center` starts it in the center, and `.circle` uses circular geometry. Pointer events draw the visual feedback. The wrapping button owns the interaction semantics.

```vue
<template>
  <button type="button" v-ripple.center.circle>View details</button>
</template>
```

[Source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/ripple/index.ts) · [Binding and cleanup](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/ripple/utils.ts)

## v-disabled

Native form controls use the Boolean `disabled` attribute. Forms, containers, and custom control roots use `inert`, removing the subtree from keyboard focus and blocking pointer interaction. Set the binding back to `false` to restore interaction. Prefer the component's own `disabled` prop when available.

[Source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/disabled/index.ts)

## Add a directive {#新增指令}

Put each directive in its own directory and default-export the factory. Use `CustomDirectiveFC<HTMLElement, T>` to type the binding. Read the element in `mounted`, handle changes in `updated`, and release listeners, timers, and third-party instances in `beforeUnmount`. Store per-element resources in a `WeakMap` when bindings are independent.

```ts
import type { CustomDirectiveFC } from '@/directives/types'

const focusWhen: CustomDirectiveFC<HTMLElement, boolean> = () => ({
  mounted(el, { value }) {
    if (value) el.focus()
  },
  updated(el, { value, oldValue }) {
    if (value && !oldValue) el.focus()
  },
})

export default focusWhen
```

Save the example as `packages/directives/src/modules/focus-when/index.ts` and use `v-focus-when`. Use a single lower-case kebab-case directory name. The registrar throws if the default export is missing or is not a function.

[Registration entry point](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/index.ts) · [Directive types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/types.ts)
