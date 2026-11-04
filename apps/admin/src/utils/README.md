# 公共工具

`@/utils` 保留原有公开导出。实现和初始化链路应从所属子模块导入，避免加载无关依赖。

| 入口                          | 职责                                                | 代表性回归测试                                                                            |
| ----------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `core`                        | 类型标签、PromiseLike、同步/异步错误处理、随机标识  | `__test__/basic`                                                                          |
| `files`                       | Data URL、文件读取、Blob/ArrayBuffer 下载与资源清理 | `__test__/basic/downloadAnyFile.spec.ts`、`__test__/utils-contracts/fileToBase64.spec.ts` |
| `app`、`equal-router-path.ts` | 环境、操作系统、缓存键前缀、路由路径比较            | `__test__/app`、`__test__/basic`                                                          |
| `cache.ts`                    | Web Storage 的 JSON 读写、命名空间和失败回退        | `__test__/cache`                                                                          |
| `element.ts`                  | DOM 类名、行内样式、查询、颜色和 CSS 尺寸           | `__test__/element`                                                                        |
| `dom.ts`                      | 截图后打开打印预览                                  | `__test__/dom`                                                                            |
| `vue`                         | 解包元素和组件根节点、渲染函数、回调与作用域清理    | `__test__/vue`、`__test__/utils-contracts/vue-target.spec.ts`                             |
| `precision.ts`                | 定点小数运算、分配与格式化                          | `__test__/precision`                                                                      |
| `legacy-crypto`               | 历史本地缓存的 AES JSON 格式                        | `__test__/utils-contracts/legacy-crypto.spec.ts`                                          |
| 对象与日期选择器辅助方法      | 自有属性更新、浅拷贝、范围清空值                    | `__test__/utils-contracts/object-date.spec.ts`                                            |

`basic.ts` 和 `c/` 是旧导入路径的兼容入口。`@/utils/precision` 转发 `@ray-template/utils/precision`，实现位于 [packages/utils](../../../../packages/utils/src/precision.ts)，供应用和文档共用。选中菜单定位实现在 `src/layout/utils`，由布局调用，历史工具入口继续转发。组件、Router 和 Store 自己的内部工具跟随所属模块维护。

- `isPromise` 判断值是否可等待；要判断函数是否声明为 `async`，使用 `isAsyncFunction`。错误包装会等待任意函数返回的 PromiseLike。
- `uuid(length, radix)` 生成自定义标识，长度须为非负安全整数，基数须在 1 到 62。它不是 RFC UUID 格式。
- 下载 Promise 表示已请求浏览器下载，无法感知磁盘写入是否完成。打印返回是否成功发起预览；纸张输出由浏览器负责。
- `setStorage` 保留现有 JSON 和缓存键格式；读取失败返回指定的回退值，显式存入的 JSON `null` 仍是 `null`。配置前缀时，批量删除只作用于该前缀下的键。
- `setClass`、`removeClass`、`hasClass`、`setStyle`、`removeStyle` 随元素引用更新；使用响应式目标时应在 Vue 作用域内创建。原生 `class` 属性变化本身不会触发 `hasClass` 重新计算。
- `removeDuplicateKeys` 保留历史名称，返回对象自有可枚举属性的浅拷贝；同名键在创建 JavaScript 对象时已由最后一次赋值决定。 `updateObjectValue` 只更新自有属性，仅当新旧值均是普通对象时浅合并。
- `legacy-crypto` 的字符串口令保留 OpenSSL 格式；原始密钥密文包含随机 IV。它是兼容层，模板的默认口令对客户端可见。
