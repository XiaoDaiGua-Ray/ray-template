# RBarcode

<script setup>
import { defineClientComponent } from 'vitepress'

const RBarcodeDemo = defineClientComponent(() => import('../../../examples/RBarcodeDemo.vue'))
</script>

`RBarcode` renders strings as barcodes with JsBarcode. Use the [QR code component](./qr-code) for QR codes.

## Interactive example {#交互示例}

Edit the text or change the symbology to see the barcode and validation feedback. The example loads `RBarcode` directly.

<RBarcodeDemo />

::: details View example source
<<< @/examples/RBarcodeDemo.vue
:::

## Usage {#用法}

```tsx
import { RBarcode } from '@/components'

export const renderOrderBarcode = (orderNo: string) => (
  <RBarcode
    text={orderNo}
    format="CODE128"
    barcodeRender="svg"
    options={{ displayValue: true, height: 60 }}
    onError={(error) => console.error('Invalid barcode format', error)}
  />
)
```

| Prop               | Default     | Description                                                                                                                                                |
| ------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`             | None        | Barcode content. Empty or invalid values can fail to render.                                                                                               |
| `format`           | `'CODE128'` | Symbology. Overrides `options.format`.                                                                                                                     |
| `barcodeRender`    | `'canvas'`  | `canvas` or `svg`.                                                                                                                                         |
| `options`          | `{}`        | JsBarcode options, for example `displayValue`, `lineColor`, `margin`, and bar width and height.                                                            |
| `width` / `height` | `'auto'`    | Display dimensions. Numbers are pixels. Set intrinsic bar width and height in `options`.                                                                   |
| `responsive`       | `false`     | Observes the container. Use `width="responsive"` or `height="responsive"` for the corresponding dimension to follow its size.                              |
| `watchText`        | `true`      | Redraws on text changes. Changes to `format`, `options` (including nested reactive fields), dimensions, or rendering medium also redraw with the same key. |
| `loading`          | `false`     | Caller-controlled spinner.                                                                                                                                 |

`responsive width="responsive" :height="48"` follows container width and keeps a 48 px height. Give the parent a definite height when using responsive height.

`onSuccess(text, format, options)`, `onError(error)`, and `onFinally()` accept one callback or an array. The success callback receives the original options. Responsive bar dimensions are internal. Rendering errors call `onError` so the caller can notify users or clear an old preview.

Supported formats are `CODE39`, `CODE128` and its `A/B/C` variants, `EAN13/EAN8/EAN5/EAN2`, `UPC`, `ITF14/ITF`, `MSI/MSI10/MSI11/MSI1010/MSI1110`, `pharmacode`, and `codabar`. Validate length and check digits for EAN or UPC. Verify printed barcodes on the intended scanner and at the final dimensions.

[Component implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RBarcode/src/Barcode.tsx) · [Format and option types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RBarcode/src/types.ts)
