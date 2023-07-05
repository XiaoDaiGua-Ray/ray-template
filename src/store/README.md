## 描述

> pinia store 仓库包。存放全局公共状态。

## 约束

- 状态管理器应该按照其用途进行分包（见名知意）
- 包名以用途名命名
  - 默认以 index.ts 作为入口，其余的辅助函数、类型，分别在该文件夹下进行补充（type.ts、helper.ts。。。）
- 仓库使用 `piniaPluginPersistedstate` 作为中间件，用于缓存仓库数据避免刷新丢失（但是该方法有缺陷，不能缓存函数）
  - 默认不全部缓存参数，如果需要缓存参数，需要在 `defineStore` 第三个参数配置 `persist` 属性
  - `defineStore` 第一个参数必须全局唯一
  - 缓存插件 key 应该按照 `piniaXXXStore` 格式命名（XXX 表示该包名称）

```ts
export const useDemoStore = defineStore('demo', () => {}, {
  persist: {
    key: 'piniaDemoStore',
    paths: ['demoState'],
    storage: sessionStorage | localStorage,
  },
})
```

- 最后在 index.ts 中暴露使用

```ts
export { useDemo } from './modules/demo/index'
```
