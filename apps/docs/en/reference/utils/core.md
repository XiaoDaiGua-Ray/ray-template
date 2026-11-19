# Core, Date, and Number Utilities {#基础、日期和数值工具}

Import these utilities from `@/utils`. Core implementations are available from `@/utils/core` and precision functions from `@/utils/precision`.

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
import PrecisionDemo from '../../../examples/PrecisionDemo.vue'
</script>

## Core utilities example {#基础工具交互示例}

Compare PromiseLike values with async functions, try synchronous and asynchronous error callbacks, or inspect paths, date ranges, and object updates.

<AdminExample path="/docs-core-utils" title="Type, identifier, error, path, and date utilities" />

::: details View core example source
<<< @/../admin/src/views/demo/docs-core-utils.tsx
:::

## Types, identifiers, and error handling {#类型、标识和错误处理}

| API                                              | Input and return value                                                                                                                                                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isValueType<T>(value, type)`                    | Checks the `Object.prototype.toString` tag. Ordinary and async functions both match `Function`.                                                                                                                                          |
| `isPromise<T>(value)`                            | Returns `true` for a callable `then`, including custom PromiseLike values.                                                                                                                                                               |
| `isAsyncFunction(fn)`                            | Tests for an `async` declaration. Returning a promise from an ordinary function does not match.                                                                                                                                          |
| `uuid(length = 16, radix = 62)`                  | Web Crypto random identifier. The character set is digits, uppercase letters, then lowercase letters. Radix is 1–62 and length is a nonnegative safe integer. Invalid input throws `RangeError`. The identifier uses this custom format. |
| `callWithErrorHandling(fn, onError, args?)`      | Returns the synchronous result. On exception, calls the callback and returns `undefined`. It does not await promises.                                                                                                                    |
| `callWithAsyncErrorHandling(fn, onError, args?)` | Awaits the result and handles both synchronous exceptions and rejections. Errors thrown by the callback reach the caller.                                                                                                                |

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

## Objects, paths, and dates {#对象、路径和日期}

- `updateObjectValue(obj, key, value, callback?)` updates only own properties. If both values are plain objects, it shallow-merges them. Otherwise it replaces the old value. Success invokes the callback.
- `removeDuplicateKeys(obj)` returns a shallow copy of own enumerable properties. Duplicate keys in a JavaScript literal already use the last value by object creation.
- `equalRouterPath(a, b)` ignores query, hash, and trailing slash. Use full paths when filters or tab instances matter.
- `getDateByNaiveDatePicker(value, isRange)` converts an empty range from `null` to `[null, null]` and preserves other values, including units, time zone, and format.
- `getAppEnvironment()` exposes Vite `import.meta.env` for values such as `MODE`, `DEV`, and `PROD`. Keep secrets out of client-visible configuration.
- `detectOperatingSystem()` uses the User-Agent to return an `OperatingSystem` such as iOS (including iPad with a desktop identifier), Android, Windows, macOS, Linux, or Unknown. Use it for display hints and detect capabilities separately.

## Fixed-point arithmetic {#定点运算}

`CurrencyArguments` can be a number, string, or currency.js instance. The template defaults to eight decimal places. Results are currency.js instances with `.value` and `.toString()`.

### Interactive example {#交互示例}

Change both numbers and compare `add` with JavaScript `+`. This example calls `@ray-template/utils/precision` directly.

<PrecisionDemo />

::: details View example source
<<< @/examples/PrecisionDemo.vue
:::

The admin precision demo also provides subtraction, multiplication, division, and allocation.

<AdminExample path="/precision" title="Fixed-point arithmetic and allocation" />

::: details View the complete precision demo source
<<< @/../admin/src/views/demo/precision/index.tsx
:::

### API

| API                                   | Behavior                                                                                                                                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add(...values)`                      | Sum. No arguments return zero.                                                                                                                                          |
| `subtract(first, ...rest)`            | Subtract in order.                                                                                                                                                      |
| `multiply(first, ...rest)`            | Multiply in order, parsing string factors first.                                                                                                                        |
| `divide(first, ...rest)`              | Divide in order. Zero divisors or nonfinite results throw `RangeError`.                                                                                                 |
| `format(value, options?)`             | Convert at the chosen precision. Defaults to a number. `type: 'string'` returns a string retaining precision.                                                           |
| `distribute(value, length, options?)` | Split evenly and assign rounding remainders to the first shares. `0` and `1` both mean one share. Negative or noninteger counts throw. Supports `precision` and `type`. |
| `isCurrency(value)`                   | Checks for an instance of the current currency.js class.                                                                                                                |

```ts
import { add, distribute, format } from '@/utils'

export const amount = format(add('0.1', '0.2'), {
  precision: 2,
  type: 'string',
})
export const parts = distribute(10, 3, { precision: 2, type: 'string' })
```

Define decimal places and rounding rules for allocation and settlement in the business code. currency.js stores scaled integers as JavaScript numbers, so the amount times `10 ** precision` must remain within the safe integer range. Transfer strings or integer minor units across APIs to avoid binary floating-point artifacts in display.

[Core utilities](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/utils/src/core/index.ts) · [Precision implementation](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/utils/src/precision.ts) · [Date picker helper](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/utils/get-date-by-naive-date-picker.ts)
