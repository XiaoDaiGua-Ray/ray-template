## global-variable

简单的管理全局响应式变量，但是不支持缓存。

创建该模块是因为在有时候不需要 `pinia` 这么复杂流程的全局变量。所以该模块管理的都是一些简单的全局变量，并且不支持缓存。

## 添加全局变量

1. 首先在 `variableState` 变量中添加对应变量
2. 调用对应方法获取、更新变量

```ts
// 添加变量
const variableState = reactive({
  globalSpinning: false,
  globalDrawerValue: false,
  yourGlobalValue: 'demo value',
})

// 更新变量
setVariable(key, value)

// 获取非响应式变量
const yourGlobalValue = getVariable('yourGlobalValue') // Readonly<demo value>

// 获取响应式变量
const yourGlobalValue = getVariableToRefs('yourGlobalValue') // Readonly<Ref<demo value>>
```

> 注意，避免滥用该模块。可能会导致管理不当引起内存泄漏。
