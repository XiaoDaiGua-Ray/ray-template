## router 拓展

## LAYOUT 说明

> router modules 包中的路由模块会与菜单一一映射，也就是说，路由模块的配置结构会影响菜单的展示。当你有子菜单需要配置时，你需要使用该组件。

```ts
import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const demo: AppRouteRecordRaw = {
  /** 路由路径，如果为根菜单且无有菜单的时候可以配置为空字符串 */
  path: '/demo',
  /** views component name，必须与组件 name 属性匹配，否则缓存属性会失效 */
  name: 'RDemo',
  /** 这样配置后，就无须在 views 中重复写 <view-router /> 了 */
  component: LAYOUT,
  meta: {
    /** t 方法是一个纯函数，为了配合 i18n ally 插件提示使用 */
    i18nKey: t('menu.Demo'),
    icon: 'demo',
    order: 0,
  },
  children: [
    {
      path: '/demo-child',
      name: 'RDemoChild',
      component: () => import('@/views/demo-child/index'),
      meta: {
        i18nKey: t('menu.DemoChild'),
        icon: 'demo',
        order: 0,
      },
    },
  ],
}

export default dashboard
```

## 类型

```ts
interface RouteMeta {
  order?: number
  i18nKey: string
  icon?: string
  windowOpen?: string
  role?: string[]
  hidden?: boolean
  noLocalTitle?: string | number
  ignoreAutoResetScroll?: boolean
  keepAlive?: boolean
  sameLevel?: boolean
  dev?: string | string[]
}
```

## 说明

```
order: 菜单顺序，值越大越靠后。仅对顶层有效，子菜单该值无效
i18nKey: i18n 国际化 key, 会优先使用该字段
icon: icon 图标， 用于 Menu 菜单(依赖 RIcon 组件实现)
windowOpen: 超链接打开（新开窗口打开）
role: 权限表
hidden: 是否显示
noLocalTitle: 不使用国际化渲染 Menu Titile
ignoreAutoResetScroll: 该页面内容区域自动初始化滚动条位置
keepAlive: 是否缓存该页面（需要配置 APP_KEEP_ALIVE setupKeepAlive 属性为 true 启用才有效）
sameLevel: 是否标记该路由为平级模式，如果标记为平级模式，会使路由菜单项隐藏。如果在含有子节点处，设置了该属性，会导致子节点全部被隐藏。并且该模块，在后续的使用 url 地址导航跳转时，如果在非当前路由层级层面跳转的该路由，会在当前的面包屑后面追加该模块的信息，触发跳转时，不会修改面包屑、标签页（优先级最高）
dev: 按照当前环境进行匹配（优先级最低）
```

### routerCopilot

> 该文件提供了一些辅助方法，让你更方便的做一些事情。系统其他地方引用了该方法，所以删除需谨慎。

### useVueRouter

> 二次封装了一个 router hook 方法，让你能够在 setup 环境之外使用 router。建议都使用该方法（useVueRouter）而不是 useRouter。

## 路由添加规则

- modules 中每一个 ts 文件视为一个路由模块
- path 以 `/` 开头则视为根路由
- 如果 path 为根路由，且不没有子级，则直接返回该路由
- 如果 path 为根路由，且不含有子级，则拼接完整 path 路径，然后返回最后一层路由
- 子级中不会存在 `/` 开头的情况（模板约定约束），如果存在则不用管，按照前三条逻辑执行代码，如果有误，由开发人员手动更改配置

```ts
const demo = {
  path: '/multi',
  name: 'MultiMenu',
  meta: {
    i18nKey: 'MultiMenu',
    icon: 'table',
  },
  children: [
    {
      path: 'multi-menu-one',
      name: 'MultiMenuOne',
      meta: {
        noLocalTitle: '多级菜单-1',
      },
      key: 'multi-menu-one',
      breadcrumbLabel: '多级菜单-1',
      show: true,
    },
    {
      path: 'multi-menu-two',
      name: 'MultiMenuTwo',
      meta: {
        noLocalTitle: '多级菜单-2',
      },
      children: [
        {
          path: 'sub-menu',
          name: 'SubMenu',
          meta: {
            noLocalTitle: '多级菜单-2-1',
          },
          key: 'sub-menu',
          breadcrumbLabel: '多级菜单-2-1',
          show: true,
        },
      ],
      key: 'multi-menu-two',
      breadcrumbLabel: '多级菜单-2',
      show: true,
    },
  ],
}

// 转换后

const transform = [
  {
    path: '/multi/multi-menu-one',
    name: 'MultiMenuOne',
    meta: {
      noLocalTitle: '多级菜单-1',
    },
    key: 'multi-menu-one',
    breadcrumbLabel: '多级菜单-1',
    show: true,
  },
  {
    path: '/multi/multi-menu-two/sub-menu',
    name: 'SubMenu',
    meta: {
      noLocalTitle: '多级菜单-2-1',
    },
    key: 'sub-menu',
    breadcrumbLabel: '多级菜单-2-1',
    show: true,
  },
]
```
