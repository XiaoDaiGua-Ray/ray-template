# Vue and Browser Utilities {#vue-与浏览器工具}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

## Interactive example {#交互示例}

Change the element's color and dimensions to inspect classes, queries, and styles. You can also start or stop a Vue scope, convert the sample PNG, download a sample file, or open print preview.

<AdminExample path="/docs-browser-utils" title="Vue, DOM, and file utilities" layout :height="570" />

::: details View example source
<<< @/../admin/src/views/demo/docs-browser-utils.tsx
:::

## Resolve Vue targets {#vue-目标解析}

`BasicTarget<T>` can be an element, component instance, ref, getter, or empty value. `unrefElement(target, fallback?)` unwraps it at call time and prefers `$el` for components. A multi-root component's `$el` may be unsuitable for DOM operations. Bind a native element ref for capture, fullscreen, or styling.

| Utility                                   | Behavior                                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `call(fnOrFns, ...args)`                  | Calls one function or an array in order, forwarding the arguments.                                                     |
| `renderNode(value, { defaultElement }?)`  | Normalizes to a render function. Only `null` and `undefined` use the fallback. `0` and empty strings are preserved.    |
| `effectDispose(cleanup)`                  | Registers cleanup and returns `true` in an active effect scope. Otherwise returns `false` and the caller owns cleanup. |
| `watchEffectWithTarget(effect, options?)` | Compatibility entry point for Vue `watchEffect`. Returns a stop handle and stops with its active scope.                |

## DOM, styling, and sizing {#dom、样式和尺寸}

| API                                                      | Behavior                                                                                                                                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setClass(target, names)` / `removeClass(target, names)` | Applies to the current and replacement targets. Accepts whitespace-separated names or an array. `removeAllClass` clears all classes.                                         |
| `hasClass(target, names)`                                | Reactive Boolean, true if any complete class name matches. Tracks target changes. An external class edit does not trigger recalculation.                                     |
| `setStyle(target, styles)`                               | Accepts an object, declaration string, or array of strings and preserves other inline styles. Supports camelCase, custom properties, and `!important`.                       |
| `removeStyle(target, names)`                             | Removes inline styles by their CSS or camelCase names.                                                                                                                       |
| `autoPrefixStyle(name)`                                  | Returns a compatibility map of the original property and legacy prefixed names without touching the DOM.                                                                     |
| `completeSize(value, unit = 'px')`                       | Adds units to numbers and numeric strings. Keeps percentages, CSS keywords, and expressions.                                                                                 |
| `colorToRgba(color, alpha = 1, fallback?)`               | Supports comma-separated RGB and HSL and common Hex values. Hex with alpha retains it. Unknown formats use the given fallback or the original string.                        |
| `queryElements(selector, { defaultElement }?)`           | Returns DOM elements. `attr:data-id` is equivalent to an attribute selector. No matches return an empty array. An empty or invalid selector with no fallback returns `null`. |
| `positionSelectedMenuItem()`                             | Scrolls a rendered active menu item into view if needed. Expand its ancestors and wait for the DOM first.                                                                    |

Class and style functions observe target changes. Create them in component setup or an effect scope. With SSR, call APIs that read `document` or `window` after mounting.

## Files, downloads, and printing {#文件、下载和打印}

| API                                                       | Behavior                                                                                                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fileToBase64(file)`                                      | Promise of a Data URL with MIME type. Read failure or abort rejects.                                                                                                |
| `arrayBufferToBase64Image(buffer)`                        | Adds a PNG Data URL prefix to PNG bytes. It does not convert other formats.                                                                                         |
| `downloadBase64File(url, fileName)`                       | Starts download through a temporary link, then cleans up.                                                                                                           |
| `downloadAnyFile(data, fileName)`                         | Accepts Data URL, Blob, File, or ArrayBuffer. Binary data uses a temporary object URL. The promise resolves once the download is initiated.                         |
| `printDom(target, { printOptions?, domToImageOptions? })` | Captures the DOM as JPEG, then opens print preview. Returns `Promise<boolean>`, logs failures and returns `false`, and updates the global Loading Bar if available. |

```ts
import { downloadAnyFile, fileToBase64 } from '@/utils'

export const previewFile = (file: File) => fileToBase64(file)
export const downloadReport = (pdf: Blob) => downloadAnyFile(pdf, 'report.pdf')
```

[DOM utilities](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/composables/src/element.ts) · [File utilities](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/utils/src/files/index.ts) · [Vue utilities](https://github.com/XiaoDaiGua-Ray/ray-template/tree/main/packages/composables/src/vue) · [Capture and print hooks](../hooks/output)
