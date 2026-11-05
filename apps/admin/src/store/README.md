## 描述

> 所有全局可变 UI 状态统一由 Pinia 管理，按用途分包，通过 `src/store/hooks` 暴露响应式 getters 和 actions。

## 约束

- 状态管理器应该按照其用途进行分包（见名知意）
- 包名以用途名命名
  - 默认以 index.ts 作为入口，其余的辅助函数、类型，分别在该文件夹下进行补充（type.ts、helper.ts。。。）
- 仓库使用 `piniaPluginPersistedstate` 作为中间件，用于缓存仓库数据避免刷新丢失（但是该方法有缺陷，不能缓存函数）
  - 默认不全部缓存参数，如果需要缓存参数，需要在 `defineStore` 第三个参数配置 `persist` 属性
  - `defineStore` 第一个参数必须全局唯一
  - 缓存插件 key 应该按照 `piniaXXXStore` 格式命名（XXX 表示该包名称）

```ts
export const piniaDemoStore = defineStore(
  'demo',
  () => {
    const demoRef = ref('hello')

    const updateDemoRef = (str: string) => (demoRef.value = str)

    return {
      demoRef,
      updateDemoRef,
    }
  },
  {
    persist: {
      key: 'piniaDemoStore',
      pick: ['demoRef'],
      storage: localStorage,
    },
  },
)
```

- 注册对应的 getters actions

```ts
// piniaDemoStore
import piniaDemoStore from '../index'

export const useDemoGetters = () => {
  const variable = piniaDemoStore()

  const getDemoRef = computed(() => variable.demoRef)

  return {
    getDemoRef,
  }
}

export const useMenuActions = () => {
  const { updateDemoRef } = piniaDemoStore()

  return {
    updateDemoRef,
  }
}
```

- 最后在 index.ts 中暴露

```ts
export { useDemoGetters, useMenuActions } from './modules/demo'
```

- 使用

```ts
import { useDemoGetters, useMenuActions } from '@/store'
```

## 运行时状态与布局偏好

- `runtime`：全局加载、移动抽屉、页面刷新、内容最大化和内容加载动画。通过 `useRuntimeGetters` / `useRuntimeActions` 读取和修改；不持久化，应用卸载时释放 Store 与计时器。
- `lock-screen`：锁屏状态也归入 Pinia，保留历史布尔值格式、缓存 key 与跨标签页同步。
- `setting.layoutConfig`：布局模式、内容宽度与间距、顶栏和页脚固定方式。通过现有 `useSettingGetters` / `useSettingActions` 操作，使用原有设置缓存 key。旧缓存补默认值，不清空历史偏好。
- 删除了独立的 `global-variable` 包；原五个状态名保留在 runtime 中，调用方改为 Store hooks。新增全局状态继续按用途放入 `src/store/modules`，不在普通模块创建共享 reactive 单例。

```ts
import { useRuntimeActions, useRuntimeGetters } from '@/store'

const { globalSpinning } = useRuntimeGetters()
const { setRuntimeState } = useRuntimeActions()
setRuntimeState('globalSpinning', true)
// 异步任务结束后，务必恢复加载状态。
setRuntimeState('globalSpinning', false)
```

布局用法和插槽见 [布局说明](../layout/README.md)。

## 菜单同步

- 菜单树和路径索引在角色变化或显式刷新时构建，不修改模块中的原始路由。路由完成后用 Vue Router 已匹配的记录同步标签页和面包屑。
- 保留原有缓存键和标签列表结构。恢复时按已注册路由和角色重建旧标签，忽略已经删除或不可访问的路由。只有标签列表变化时才写会话缓存。
- KeepAlive 按最近访问顺序更新，去重并按上限裁剪。主题合并仅由生效主题驱动，色弱模式和文档标题独立监听。

## 最近访问与收藏

`navigation-history` 经 `useNavigationHistoryGetters` / `useNavigationHistoryActions` 暴露。按会话用户 id 隔离 Local Storage，只保存最多 10 个去重的最近菜单路径与收藏路径，不保存搜索词、标题、URL 查询参数或页面数据。显示和导航时从当前可见菜单重新解析，已撤权、隐藏或删除的路径不显示。切换账号即时清空内存视图并读取对应缓存；清空历史不删除收藏。
