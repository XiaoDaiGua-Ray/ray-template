# RModal 与弹窗

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

`RModal` 继承 Naive UI Modal 的 `show`、`preset`、关闭事件和插槽，增加预设宽度和全屏卡片。声明式弹窗通过 `show` / `onUpdateShow` 或 `v-model:show` 控制。

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
          查看报表
        </NButton>
        <RModal
          show={show.value}
          onUpdateShow={(value) => {
            show.value = value
          }}
          preset="card"
          title="库存报表"
          cardWidth={960}
        >
          报表内容
        </RModal>
      </>
    )
  },
})
```

| 属性          | 默认    | 作用范围                   |
| ------------- | ------- | -------------------------- |
| `width`       | `600`   | 未指定预设时的宽度。       |
| `cardWidth`   | `600`   | `preset="card"` 的宽度。   |
| `dialogWidth` | `446`   | `preset="dialog"` 的宽度。 |
| `fullscreen`  | `false` | 仅 `card` 预设生效。       |

宽度接受数字或 CSS 尺寸。`fullscreen` 让卡片占满窗口，正文在溢出时滚动；它不调用浏览器全屏。`default`、`header`、`footer` 等插槽依 Naive UI 预设处理，组件原样转发。

## 交互示例

<AdminExample path="/modal-demo" title="声明式与命令式弹窗" />

::: details 查看示例源码
<<< @/../admin/src/views/demo/modal-demo/index.tsx
:::

## 命令式弹窗

`@/components` 的 `useModal()` 已弃用，兼容代码仍可通过 `create(options)` 和 `destroyAll()` 调用。`create` 返回 Naive UI 弹窗句柄，支持 `fullscreen`、`width`、`cardWidth`、`dialogWidth` 等兼容配置。新代码从 `naive-ui` 导入 `useModal`，在 `NModalProvider` 的后代调用；需要模板专用全屏样式时用声明式 `RModal`。提示用户确认危险操作时也可以用全局 [Dialog Provider](./app)。

[组件源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RModal/src/Modal.tsx) · [兼容 Hook](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RModal/src/hooks/useModal.ts) · [回归用例](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/__test__/components/modal.spec.ts)
