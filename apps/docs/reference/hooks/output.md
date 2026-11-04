# DOM 截图与打印

## useDomToImage

`useDomToImage(target, options?)` 返回 `create(format?)`。调用时从元素、ref 或 getter 解析目标，缺省格式为 `jpeg`，`options.imageType` 设置默认值，单次 `create(format)` 优先。Promise 按格式推断返回值：

| 格式                 | 返回                  |
| -------------------- | --------------------- |
| `jpeg`、`png`、`svg` | 数据 URL 字符串。     |
| `blob`               | `Blob \| null`。      |
| `canvas`             | `HTMLCanvasElement`。 |
| `pixelData`          | `Uint8ClampedArray`。 |

`options` 也可传 html-to-image 的选项，如 `backgroundColor`、`pixelRatio`、`filter`。`beforeCreate(element)` 在目标检查前调用，`created(result, element)` 在成功后调用；回调的结果类型涵盖全部格式，应先检查类型。`createdError(error)` 接收错误，Promise 仍以 `Error` 拒绝；`finally(element)` 每次都会调用，目标未解析时可能为空。截图要在目标挂载后执行，跨域图片和字体需满足浏览器加载限制。

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

`usePrint(target, options?)` 返回 `print()`，调用时解包目标。接受 DOM 目标、URL 或字符串、`Blob`、`Uint8ClampedArray`、对象数组。`UsePrintOptions` 是 print-js 配置中除 `printable` 外的字段。

- DOM 默认以 `html` 打印。字符串默认按 `pdf` 处理；图片 URL、JSON 数组请分别指定 `type: 'image'`、`type: 'json'`（JSON 同时传 `properties`）。
- 图片 MIME 的 Blob 默认以 `image` 处理，其他 Blob 和字节数组默认以 `pdf` 处理。二进制目标会先异步转为数据 URL，PDF 会去掉数据 URL 前缀。
- 空目标或空字符串直接返回。DOM 等同步分支返回 `void`，二进制转换分支返回 Promise；统一使用 `await print()` 可以捕获转换错误。成功发起打印流程无法确认纸张输出。

```ts
import { usePrint } from '@/hooks'
import { ref } from 'vue'

export function useReportPrint() {
  const report = ref<HTMLElement>()
  const { print } = usePrint(report, {
    type: 'html',
    documentTitle: '库存报表',
  })
  return { report, print }
}
```

TablePro 内置打印按当前页和可见列生成报表。要保留自定义业务排版，参考 [TablePro 打印](../table-pro#打印与-csv)。

源码：[useDomToImage](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/useDomToImage.ts) · [usePrint](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/usePrint.ts)
