# DOM Capture and Printing {#dom-截图与打印}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

## Interactive example {#交互示例}

<AdminExample path="/web-hooks" title="Capture and print DOM content" focus="useDomToImage,usePrint" />

::: details View example source
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

## useDomToImage

`useDomToImage(target, options?)` returns `create(format?)`. It resolves an element, ref, or getter at call time. The default format is `jpeg`, `options.imageType` sets a different default, and a per-call `format` takes precedence. The promise result depends on the format.

| Format               | Return value        |
| -------------------- | ------------------- |
| `jpeg`, `png`, `svg` | Data URL string     |
| `blob`               | `Blob \| null`      |
| `canvas`             | `HTMLCanvasElement` |
| `pixelData`          | `Uint8ClampedArray` |

`options` also accepts html-to-image settings such as `backgroundColor`, `pixelRatio`, and `filter`. `beforeCreate(element)` runs before checking the target and `created(result, element)` runs on success. Its result type covers all formats, so narrow it first. `createdError(error)` receives errors and the promise still rejects with `Error`. `finally(element)` runs every time and can receive an unresolved target. Capture after mount. Cross-origin images and fonts must satisfy browser loading rules.

The renderer loads on the first `create`, so pages without capture avoid downloading it. Load failures also invoke the error and cleanup callbacks above.

```ts
import { useDomToImage } from '@/hooks'
import { ref } from 'vue'

export function useReportImage() {
  const report = ref<HTMLElement>()
  const { create } = useDomToImage(report, { imageType: 'png', pixelRatio: 2 })
  return {
    report,
    exportPng: () => create(),
    exportCanvas: () => create('canvas'),
  }
}
```

## usePrint

`usePrint(target, options?)` returns `print()`, which unwraps the target when called. It accepts a DOM target, URL or string, `Blob`, `Uint8ClampedArray`, or an array of objects. `UsePrintOptions` consists of print-js configuration except `printable`.

- DOM targets use `html` by default, and strings use `pdf`. Set `type: 'image'` for image URLs or `type: 'json'` for object arrays. JSON also needs `properties`.
- Image MIME blobs use `image`. Other blobs and byte arrays default to `pdf`. Binary targets become data URLs asynchronously. PDF printing removes the data URL prefix.
- Missing targets and empty strings return immediately. Synchronous branches such as DOM return `void`, and binary conversions return a promise. Use `await print()` to catch conversion errors. A requested print flow leaves physical output to the browser and user.

```ts
import { usePrint } from '@/hooks'
import { ref } from 'vue'

export function useReportPrint() {
  const report = ref<HTMLElement>()
  const { print } = usePrint(report, {
    type: 'html',
    documentTitle: 'Inventory report',
  })
  return { report, print }
}
```

Built-in TablePro printing uses the current page and visible columns. For custom business layouts, see [TablePro printing](../table-pro#打印与-csv).

[useDomToImage source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useDomToImage.ts) · [usePrint source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/usePrint.ts)
