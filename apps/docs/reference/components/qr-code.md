# 二维码

Ray Template 直接使用 `vue3-next-qrcode` 的 `Vue3NextQrcode`，公开实例类型为 `QRCodeInst`。组件演示和登录扫码占位页分别使用它。

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
        <NButton onClick={() => qr.value?.downloadQRCode()}>下载</NButton>
      </>
    )
  },
})
```

`text` 设置内容，默认可随内容变化重绘。`logoImage`、`backgroundImage`、`gifBackgroundURL`、`dotScale`、`colorDark` 可调整样式。带背景的二维码要实际扫码检查清晰度，远程素材还受跨域和浏览器加载限制。

`status` 可显示 `loading`、`error` 等状态，`onReload` 在重试时通知调用方。`downloadQRCode()` 等到实例挂载后调用。二维码只表达数据，生成成功与扫码认证成功是两回事；登录需要业务后端签发和验证对应凭据。

[二维码示例](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/demo/qrcode/index.tsx) · [登录页扫码入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/login/components/QRCodeSigning/index.tsx)
