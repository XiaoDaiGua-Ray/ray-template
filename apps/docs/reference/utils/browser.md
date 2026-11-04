# Vue 与浏览器工具

## Vue 目标解析

`BasicTarget<T>` 可为元素、组件实例、ref、getter 或空值，`unrefElement(target, fallback?)` 在调用时解包；组件优先返回 `$el`。多根组件的 `$el` 未必是可操作的元素。截图、全屏、样式操作请优先绑定明确的原生 DOM ref。

| 工具                                      | 行为                                                                              |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `call(fnOrFns, ...args)`                  | 调用一个函数或按顺序调用回调数组，透传参数。                                      |
| `renderNode(value, { defaultElement }?)`  | 规范化成渲染函数。仅 `null` 或 `undefined` 用回退，`0` 和空字符串保留。           |
| `effectDispose(cleanup)`                  | 有当前 effect scope 时登记清理并返回 `true`，否则返回 `false`，需调用方自行释放。 |
| `watchEffectWithTarget(effect, options?)` | 对 Vue `watchEffect` 的兼容入口，返回停止句柄；在有效作用域创建时会随作用域停止。 |

## DOM、样式和尺寸

| API                                                      | 行为                                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `setClass(target, names)` / `removeClass(target, names)` | 作用于当前和后续替换的目标。支持空白分隔字符串或数组；移除时 `removeAllClass` 清空 class。                |
| `hasClass(target, names)`                                | 返回响应式布尔值，任一完整类名匹配即为真。只随目标引用更新，外部改 class 属性本身不会触发重算。           |
| `setStyle(target, styles)`                               | 支持样式对象、声明字符串或字符串数组，保留其他行内样式。支持 camelCase、CSS 自定义属性与 `!important`。   |
| `removeStyle(target, names)`                             | 按 CSS 名称或 camelCase 删除行内样式。                                                                    |
| `autoPrefixStyle(name)`                                  | 返回原属性和历史前缀名的兼容映射，不执行 DOM 操作。                                                       |
| `completeSize(value, unit = 'px')`                       | 数字、纯数字字符串补单位，保留百分比、CSS 关键字和表达式。                                                |
| `colorToRgba(color, alpha = 1, fallback?)`               | 支持逗号形式 RGB/HSL 与常见 Hex。带透明度的 Hex 保留其透明度，未知格式回退到指定值或原字符串。            |
| `queryElements(selector, { defaultElement }?)`           | 返回 DOM 元素数组。`attr:data-id` 等同于属性选择器。无匹配返回空数组，空或非法选择器无回退时返回 `null`。 |
| `positionSelectedMenuItem()`                             | 将已渲染且超出可视区的当前菜单滚入视野。调用前展开父级并等待 DOM 渲染。                                   |

类名与样式函数内部监听目标变化，在组件 setup 或 effect scope 内创建。SSR 下访问 `document`、`window` 的方法应推迟到挂载后。

## 文件、下载和打印

| API                                                       | 行为                                                                                                                         |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `fileToBase64(file)`                                      | 返回带 MIME 的 Data URL Promise，读取错误或中止会拒绝。                                                                      |
| `arrayBufferToBase64Image(buffer)`                        | 把 PNG 字节加上 PNG Data URL 前缀，不转换其他图像格式。                                                                      |
| `downloadBase64File(url, fileName)`                       | 以临时链接触发下载，清理链接。                                                                                               |
| `downloadAnyFile(data, fileName)`                         | 接收 Data URL、Blob、File、ArrayBuffer。二进制使用临时对象 URL；Promise 完成表示已发起下载。                                 |
| `printDom(target, { printOptions?, domToImageOptions? })` | 先将 DOM 截成 JPEG，再发起打印预览。返回 `Promise<boolean>`；失败记录错误并返回 `false`，若存在全局 Loading Bar 会同步状态。 |

```ts
import { downloadAnyFile, fileToBase64 } from '@/utils'

export const previewFile = (file: File) => fileToBase64(file)
export const downloadReport = (pdf: Blob) => downloadAnyFile(pdf, 'report.pdf')
```

[DOM 工具](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/element.ts) · [文件工具](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/utils/src/files/index.ts) · [Vue 工具](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/packages/composables/src/vue) · [截图与打印 Hooks](../hooks/output)
