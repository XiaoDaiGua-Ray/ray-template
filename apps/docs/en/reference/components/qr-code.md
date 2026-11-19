# QR Codes {#二维码}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

Ray Template uses `Vue3NextQrcode` from `vue3-next-qrcode` directly. Its public instance type is `QRCodeInst`. The component demo and QR sign-in placeholder both use it.

## Interactive example {#交互示例}

<AdminExample path="/qrcode" title="QR code options and preview" />

::: details View example source
<<< @/../admin/src/views/demo/qrcode/index.tsx
:::

```tsx
import { NButton } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { Vue3NextQrcode, type QRCodeInst } from 'vue3-next-qrcode'

export default defineComponent({
  setup() {
    const qr = ref<QRCodeInst>()
    return () => (
      <>
        <Vue3NextQrcode ref={qr} text="https://example.com/report" />
        <NButton onClick={() => qr.value?.downloadQRCode()}>Download</NButton>
      </>
    )
  },
})
```

`text` sets the encoded content and redraws on change by default. Adjust appearance with `logoImage`, `backgroundImage`, `gifBackgroundURL`, `dotScale`, and `colorDark`. Test scannability when adding backgrounds. Remote assets are subject to cross-origin and browser loading restrictions.

`status` displays states such as `loading` and `error`. `onReload` notifies the caller on retry. Call `downloadQRCode()` after the instance mounts. A generated QR code represents data. QR sign-in requires a backend to issue and verify the corresponding credential.

[QR code example](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/demo/qrcode/index.tsx) · [QR sign-in entry point](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/login/components/QRCodeSigning/index.tsx)
