# RBarcode

<script setup>
import { defineClientComponent } from 'vitepress'

const RBarcodeDemo = defineClientComponent(() => import('../../examples/RBarcodeDemo.vue'))
</script>

`RBarcode` 使用 JsBarcode 将字符串绘成条码。二维码使用[二维码组件](./qr-code)。

## 交互示例

编辑文本或切换制式，观察条码和校验提示。示例直接加载模板的 `RBarcode`。

<RBarcodeDemo />

::: details 查看示例源码
<<< @/examples/RBarcodeDemo.vue
:::

## 用法

```tsx
import { RBarcode } from '@/components'

export const renderOrderBarcode = (orderNo: string) => (
  <RBarcode
    text={orderNo}
    format="CODE128"
    barcodeRender="svg"
    options={{ displayValue: true, height: 60 }}
    onError={(error) => console.error('条码格式无效', error)}
  />
)
```

| 属性               | 默认        | 说明                                                                                                      |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| `text`             | 无          | 条码文本。留空或传入不符合格式的值时可能渲染失败。                                                        |
| `format`           | `'CODE128'` | 条码制式，覆盖 `options.format`。                                                                         |
| `barcodeRender`    | `'canvas'`  | `canvas` 或 `svg`。                                                                                       |
| `options`          | `{}`        | JsBarcode options，如 `displayValue`、`lineColor`、`margin`、条宽和条高。                                 |
| `width` / `height` | `'auto'`    | 显示尺寸，数字按像素。与 `options` 中条码自身的条宽、条高不同。                                           |
| `responsive`       | `false`     | 监听容器尺寸；用 `width="responsive"` 或 `height="responsive"` 让对应尺寸随容器调整。                     |
| `watchText`        | `true`      | 文本变化时重绘。独立改变 `format`、`options` 或渲染介质时不要依赖文本 watcher，可以按配置更换组件 `key`。 |
| `loading`          | `false`     | 控制 Spin；调用方负责开关。                                                                               |

`onSuccess(text, format, options)`、`onError(error)`、`onFinally()` 支持函数或回调数组。成功回调收到原始 options；组件响应式调整的条宽和条高不写回该对象。绘制异常通过 `onError` 通知，业务代码可据此提示或清理旧预览。

支持 `CODE39`、`CODE128` 及 `A/B/C` 变体、`EAN13/EAN8/EAN5/EAN2`、`UPC`、`ITF14/ITF`、`MSI/MSI10/MSI11/MSI1010/MSI1110`、`pharmacode`、`codabar`。使用 EAN 或 UPC 前验证输入长度和校验位。打印后是否可扫取决于设备和成品尺寸。

[组件实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RBarcode/src/Barcode.tsx) · [制式和选项类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RBarcode/src/types.ts)
