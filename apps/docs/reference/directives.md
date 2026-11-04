# 指令

<script setup>
import DebounceDemo from '../examples/DebounceDemo.vue'
</script>

应用在 `main.ts` 调用 `setupDirectives(app)`。注册器查找 `packages/directives/src/modules/<name>/index.ts`，调用默认导出的工厂，将返回的 Vue Directive 以目录名注册。SFC 中可直接用 `v-<name>`；从文件名和源码进入可查各指令的绑定类型。

## v-copy

绑定要复制的字符串；绑定值改变时销毁并重建 ClipboardJS 实例，卸载时销毁。Ray Admin 注册时接入消息提示。独立使用 `createCopyDirective` 时可提供自己的结果回调。复制应由用户点击触发。数字等值请先显式转为字符串。

```vue
<template>
  <button type="button" v-copy="'ORD-001'">复制订单号</button>
</template>
```

[源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/copy/index.ts)

## v-debounce 与 v-throttle

连续点击按钮，停止 500ms 后，防抖只执行一次。

<DebounceDemo />

::: details 查看示例源码
<<< @/examples/DebounceDemo.vue
:::

两者都接收 `{ func, trigger?, wait?, options? }`。`func` 必须是函数并可接收原生事件；`trigger` 默认 `'click'`，`wait` 默认 `500` 毫秒，`options` 转给 Lodash 的对应方法。防抖适合在连续输入停止后处理，节流适合限制持续触发的频率。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref('')
const requestedKeyword = ref('')
const clicks = ref(0)

const applySearch = () => {
  requestedKeyword.value = keyword.value
}
const countClick = () => {
  clicks.value += 1
}
</script>

<template>
  <input
    v-model="keyword"
    v-debounce="{ func: applySearch, trigger: 'input', wait: 300 }"
  />
  <p>已提交的查询词：{{ requestedKeyword }}</p>
  <button type="button" v-throttle="{ func: countClick, wait: 1000 }">
    点击次数 {{ clicks }}
  </button>
</template>
```

- `options.leading` / `trailing` 决定在等待周期首尾是否执行；防抖还可设 `maxWait`。挂载时读取绑定值，更新不会重绑。若回调依赖变动数据，让原函数在执行时读取响应式值。
- 当前实现将监听器句柄保存在指令工厂闭包，多个绑定实例共用同一清理位置。需要同一指令同时绑多个元素或动态修改间隔时，在组件里单独创建防抖或节流函数并清理。
- 防抖和节流只约束事件触发，异步请求仍需独立处理取消、并发或幂等。

[防抖源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/debounce/index.ts) · [节流源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/throttle/index.ts)

## v-ellipsis

`width` 必填，数字按像素；字符串可传 CSS 尺寸。`type: 'block'` 做单行省略，`type: 'line'` 使用 `line` 行截断，默认按单行处理。`popoverText: true` 把当前文本写入原生 `title`，不创建 Popover。挂载和更新时写入样式；切换模式或关掉悬浮文本不会自动删除上一次写入的样式或 `title`。经常切换的场景可以改用组件库的省略组件，或切换节点 `key`。

```vue
<template>
  <p v-ellipsis="{ type: 'line', line: 2, width: 240, popoverText: true }">
    这里放较长的说明文字，超出两行后会被省略。
  </p>
</template>
```

[源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/ellipsis/index.ts)

## v-ripple

省略绑定值或传 `true` 启用，`false` 关闭。绑定对象 `{ class: '...' }` 可指定波纹样式。`.center` 从中心扩散，`.circle` 使用圆形计算。通过 pointer 事件渲染，属于视觉反馈，交互语义仍由外层按钮负责。

```vue
<template>
  <button type="button" v-ripple.center.circle>查看详情</button>
</template>
```

[源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/ripple/index.ts) · [绑定与清理](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/ripple/utils.ts)

## v-disabled

接收布尔值并修改原生 `disabled` 属性和模板禁用样式。当前实现关闭禁用时仍会写入空的 `disabled` 属性，HTML 原生按钮将继续视为禁用。因此原生控件使用 `:disabled="busy"`，Naive UI 使用对应 `disabled` prop。对自定义控件，要同时处理指针、键盘与可访问状态；样式不能取代业务权限检查。

[源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/modules/disabled/index.ts)

## 新增指令

每个指令放在单独目录，工厂默认导出。可用 `CustomDirectiveFC<HTMLElement, T>` 标注绑定值。在 `mounted` 取得元素，在 `updated` 处理值更新，在 `beforeUnmount` 释放事件、计时器和第三方实例。多个元素需要独立数据时，把状态放在元素关联的 `WeakMap`，避免用单个变量保存全部实例的资源。

```ts
import type { CustomDirectiveFC } from '@/directives/types'

const focusWhen: CustomDirectiveFC<HTMLElement, boolean> = () => ({
  mounted(el, { value }) {
    if (value) el.focus()
  },
  updated(el, { value, oldValue }) {
    if (value && !oldValue) el.focus()
  },
})

export default focusWhen
```

将示例保存为 `packages/directives/src/modules/focus-when/index.ts`，在组件中用 `v-focus-when`。目录名按现有约定用单段小写 kebab-case。注册器要求默认导出函数，缺失会抛错。

[注册入口](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/index.ts) · [指令类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/directives/src/types.ts)
