# RModal and dialogs {#rmodal-与弹窗}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RModal` inherits Naive UI Modal's `show`, `preset`, close events, and slots, then adds preset widths and fullscreen cards. Control declarative modals with `show` and `onUpdateShow` or `v-model:show`.

```tsx
import { RModal } from '@/components'
import { NButton } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const show = ref(false)
    return () => (
      <>
        <NButton
          onClick={() => {
            show.value = true
          }}
        >
          View report
        </NButton>
        <RModal
          show={show.value}
          onUpdateShow={(value) => {
            show.value = value
          }}
          preset="card"
          title="Inventory report"
          cardWidth={960}
        >
          Report contents
        </RModal>
      </>
    )
  },
})
```

| Prop          | Default | Applies to                    |
| ------------- | ------- | ----------------------------- |
| `width`       | `600`   | Width without a preset.       |
| `cardWidth`   | `600`   | Width with `preset="card"`.   |
| `dialogWidth` | `446`   | Width with `preset="dialog"`. |
| `fullscreen`  | `false` | Card preset only.             |

Widths accept numbers or CSS dimensions. `fullscreen` stretches the card across the viewport and scrolls overflowing body content. It is a layout mode outside the browser Fullscreen API. Slots such as `default`, `header`, and `footer` are forwarded with their Naive UI preset behavior.

## Interactive example {#交互示例}

<AdminExample path="/modal-demo" title="Declarative and imperative modals" />

::: details View example source
<<< @/../admin/src/views/demo/modal-demo/index.tsx
:::

## Imperative modals {#命令式弹窗}

`useModal()` from `@/components` is deprecated. Legacy integrations can still call `create(options)` and `destroyAll()`. `create` returns a Naive UI modal handle and accepts compatibility options such as `fullscreen`, `width`, `cardWidth`, and `dialogWidth`. New code can import `useModal` from `naive-ui` and call it inside an `NModalProvider`. Use declarative `RModal` for the template's fullscreen styles. The global [Dialog provider](./app) can also confirm destructive actions.

[Component source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RModal/src/Modal.tsx) · [Compatibility hook](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RModal/src/hooks/useModal.ts) · [Regression tests](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/__test__/components/modal.spec.ts)
