# 基础、日期和数值工具

从 `@/utils` 导入以下函数。基础能力的实现位于 `@/utils/core`，精度工具也可从 `@/utils/precision` 单独导入。

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
import PrecisionDemo from '../../examples/PrecisionDemo.vue'
</script>

## 基础工具交互示例

比较 PromiseLike 与 async 函数，试试同步和异步错误回调，或观察路径、日期范围和对象更新的结果。

<AdminExample path="/docs-core-utils" title="类型判断、标识、错误、路径和日期工具" />

::: details 查看基础工具示例源码
<<< @/../admin/src/views/demo/docs-core-utils.tsx
:::

## 类型、标识和错误处理

| API                                              | 输入与返回                                                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `isValueType<T>(value, type)`                    | 按 `Object.prototype.toString` 标签判断，普通函数和 async 函数都匹配 `Function`。                                                  |
| `isPromise<T>(value)`                            | 有可调用的 `then` 时返回 `true`，包括自定义 PromiseLike。                                                                          |
| `isAsyncFunction(fn)`                            | 判断函数是否用 `async` 声明，普通返回 Promise 的函数不匹配。                                                                       |
| `uuid(length = 16, radix = 62)`                  | Web Crypto 随机标识。字符集依次是数字、大写、小写，基数范围 1–62，长度是非负安全整数。参数非法抛 `RangeError`；结果不是 RFC UUID。 |
| `callWithErrorHandling(fn, onError, args?)`      | 返回同步执行结果；抛错时调用回调并返回 `undefined`。不会等待 Promise。                                                             |
| `callWithAsyncErrorHandling(fn, onError, args?)` | 等待函数返回值，处理同步抛错和拒绝。回调自身抛错时，错误会传给调用方。                                                             |

```ts
import { callWithAsyncErrorHandling, uuid } from '@/utils'

export const draftId = () => 'draft-' + uuid(12, 36)

export function loadOrReport<T>(
  load: () => Promise<T>,
  report: (error: Error) => void,
) {
  return callWithAsyncErrorHandling(load, report)
}
```

## 对象、路径和日期

- `updateObjectValue(obj, key, value, callback?)` 只修改对象的自有属性；新旧值均为普通对象时浅合并，其他情况替换。成功后调用回调。
- `removeDuplicateKeys(obj)` 返回自有可枚举属性的浅拷贝。JavaScript 对象字面量的同名键已经在创建时由后值覆盖，不能用这个函数找回前值。
- `equalRouterPath(a, b)` 忽略 query、hash 和末尾斜杠。需要区分筛选参数或标签实例时用完整路径。
- `getDateByNaiveDatePicker(value, isRange)` 把清空的范围 `null` 转成 `[null, null]`，其他值原样保留。它不转换单位、时区或格式。
- `getAppEnvironment()` 返回 Vite 的 `import.meta.env`，用于读取 `MODE`、`DEV`、`PROD` 等。客户端可见的配置不要放密钥。
- `detectOperatingSystem()` 基于浏览器 User-Agent 返回 `OperatingSystem`，识别 iOS（含桌面标识 iPad）、Android、Windows、macOS、Linux 或 Unknown。它适合辅助显示，不代替能力检测。

## 定点运算

输入 `CurrencyArguments` 可为数字、字符串或 currency.js 实例。模板缺省精度为 8 位小数；运算结果仍是 currency.js 实例，可取 `.value` 或 `.toString()`。

### 交互示例

修改两个数，对比 `add` 与 JavaScript `+` 的结果。示例直接调用 workspace 内的 `@ray-template/utils/precision`。

<PrecisionDemo />

::: details 查看示例源码
<<< @/examples/PrecisionDemo.vue
:::

后台的精度实验还能切换减法、乘法、除法以及按份分摊。

<AdminExample path="/precision" title="定点运算与金额分摊" />

::: details 查看完整精度示例源码
<<< @/../admin/src/views/demo/precision/index.tsx
:::

### API

| API                                   | 行为                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `add(...values)`                      | 求和，无参数返回零。                                                                              |
| `subtract(first, ...rest)`            | 依次相减。                                                                                        |
| `multiply(first, ...rest)`            | 依次相乘，字符串因子会先解析。                                                                    |
| `divide(first, ...rest)`              | 依次相除，零除或非有限结果抛 `RangeError`。                                                       |
| `format(value, options?)`             | 按精度转换，默认返回数字；`type: 'string'` 返回保留精度的数字字符串。                             |
| `distribute(value, length, options?)` | 平分金额，余数优先给前几份。`0` 和 `1` 都视作一份，负数或非整数抛错；支持 `precision` 和 `type`。 |
| `isCurrency(value)`                   | 判断是否是当前 currency.js 类的实例。                                                             |

```ts
import { add, distribute, format } from '@/utils'

export const amount = format(add('0.1', '0.2'), {
  precision: 2,
  type: 'string',
})
export const parts = distribute(10, 3, { precision: 2, type: 'string' })
```

分摊或货币结算由业务明确小数位和舍入规则。currency.js 使用 JavaScript Number 存储缩放后的整数，金额乘以 `10 ** precision` 后需仍在安全整数范围内；这些方法不提供任意精度运算。保留字符串或整数分值跨接口传输可避免展示时的二进制浮点误差。

[基础函数](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/utils/src/core/index.ts) · [精度实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/utils/src/precision.ts) · [日期选择器辅助](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/get-date-by-naive-date-picker.ts)
