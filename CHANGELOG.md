# CHANGE LOG

## 4.8.4

由于 `node canvas` 本身的特性（环境问题很多），故在 `v4.8.4` 版本予以移除 `RQRCode` 组件，使用 `vue3-next-qrcode` 替代。所有的使用方法保持一致。

## Feats

- 新增 `package.json` 的 `lint` 命令，用于自动修复 `eslint, prettier` 问题

```sh
pnpm lint
```

- `useModal` 方法在 `preset = card` 并且设置了 `fullscreen` 时，现在会自动启用滚动条
- `pre-commit` 新增 `vue-tsc` 检查

## 4.8.3

## Feats

- 更新 `vue-i18n` 版本至 `9.13.1`
- 更新 `naive-ui` 版本至 `2.38.2`
- 更新 `vite` 版本至 `5.2.11`
- 更新 `vue` 版本至 `3.4.26`

## Fixes

- 同步修复 `useModal` 组件在 `preset = card` 时，不能正确显示内容的问题

## 4.8.2

破坏性更新！请仔细阅读更新日志！

更新默认 `node` 版本为 `v20.12.0`。

并且对于历史一些模块的分包进行了优化，现在更加语意化与清晰。

重构 `axios` 拦截器，使用插件式设计思想，更加强大的拓展性、可维护性！

## Feats

- 更新默认 `node` 版本为 `v20.12.0`
- `RBarcode` 相关
  - 新增 `onSuccess`, `onError`, `onFinally` 三个渲染回调
  - 新增 `watchText` 配置项，当 `text` 内容变化后，主动更新条形码，默认不启用
- 更新 `vue-tsc` 版本至 `2.0.11`
- `hooks` 包
  - `template` 包
    - 新增 `useContentScroll` 方法，用于滚动 `LayoutContent` 内容区域
    - 新增 `useSiderScroll` 方法，用于滚动 `LayoutSider` 侧边栏区域，也就是菜单区域
  - `web` 包
    - `usePagination` 类型修复，所有 `get` 方法都会准确的返回对应的类型
- `SiderBarLogo` 组件
  - 支持未配置 `icon` 时，允许截取 `title` 第一个字符作为占位
- `router` 包
  - `router types` 包，补充类型，获得更好的类型提示与配置提示
  - `combine-raw-route-modules` 方法现在会检查路由配置的 `name`, `path` 属性是否出现重复，如果重复，会直接抛出异常中断流程
  - 移除 `name` 配置项作为必选项
  - 标记 `components` 配置项为 `deprecated` 描述项
  - 增强 `AppRouteRecordRaw` 类型，现在当你显式配置了 `meta.keepAlive` 为 `true` 的时候，会提示你 `name` 必填
- `app-config` 包
  - 提供 `MessageProver` 配置
    - 限制最大消息数量为 5 条
    - 默认不启用手动关闭消息功能
- `RTable` 新增 `cardProps` 配置项，配置外层容器。
- 更新 `vue` 版本至 `3.4.25`
- 更新 `vite` 版本至 `5.2.10`
- 更新 `vite-bundle-analyzer` 版本至 `0.9.4`，新增汇总模式
- 移除 `naive-ui` 自动导入 `hooks`
- `Search` 组件
  - 优化分包逻辑
  - 现在允许在搜索菜单初始位置进行上下键切换
  - 优化搜索菜单样式
- 新增 `positionSelectedMenuItem` 方法，用于定位选中菜单项
- `hooks` 包
  - `template`
    - 新增 `useContentScroll` 方法，用于滚动 `LayoutContent` 内容区域
    - 新增 `useSiderScroll` 方法，用于滚动 `LayoutSider` 侧边栏区域，也就是菜单区域
- 重写 `AppAvatar` 组件
- `axios` 包
  - `inject` 包重命名为 `axios-interceptor`，并且拆分分包逻辑，现在以插件形式管理拦截器逻辑与注入逻辑
- 新增 `padding-line-between-statements` 规范，强制语句之间的空行

## Fixes

- 修复 `SIDE_BAR_LOGO` 未配置 `icon` 时，侧边栏不显示的问题
- 修复 `RTable` 在配置 `style.height` 时，样式会错乱的问题
- 修复 `MenuTag` 在初始化位置时不能准确滚动到当前标签页的问题

## 4.8.1

## Feats

- 新增 `RBarcode` 条形码组件，基于 `JsBarcode` 二次封装

## Fixes

- 修复 `RSegment` 分段器设置 `popover` 后警告的问题

## 4.8.0

全局破坏性更新。移除了很多包、方法，请谨慎更新。

## Feats

- 移除无意义依赖包
- `RTable` 组件
  - 强制约束使用 `useTable` 方法操作实例，移除 `expose` 暴露
  - 新增 `useCheckedRowKeys` 方法，用于操作表格选中行，该方法仅适用于选中行操作（多选、单选）
- `RForm`, `RChart` 强制约束使用对应 `useForm`, `useChart` 方法操作实例，移除 `expose` 暴露
- 优化 `usePagination` 方法修改 `paginationRef` 值类型，使用 `Ref` 签名类型
- `eslint` 规则新增禁用被标记弃用方法
- 移除 `omit`, `pick` 方法，使用 `lodash-es` 包替代
- 新增 `RSegment` 分段器组件
  > 由于是基于 [NTabs](https://www.naiveui.com/zh-CN/dark/components/tabs) 组件二开，所以也继承了该组件的一些特性（bug）
- `svg icon` 支持分包管理
- `vite-helper` 包中所有方法进行拆分，约定按照功能模块进行拆分。如果该方法属于 `vite` 插件，按照 `xx-xx-plugin` 方式命名。
- 统一所有模块的文件命名
  - `class`, `hooks` 方法统一为小驼峰命名
    > 示例: `MyClass`, `useMyHooks`
  - `component` 的文件夹与组件名称统一为大驼峰命名
    > 示例: `MyComponent`, `ChildComponent`
  - `utils`, `custom function` 统一为蛇形命名
    > 示例: `custom-function`, `custom-utils`
- 新增 `v-ripple` 水波纹指令
- 新增 `v-lazy-show` 惰性 `v-show` 指令
- `GlobalSearchButton` 组件样式优化
- `useElementFullscreen` 方法
  - 移除缓存 `transition` 样式还原方式，使用 `options.transition` 方式配置，默认为 `all 0.3s var(--r-bezier)`
- 优化 `LayoutContent` 网页最大化动画效果
- `global-variable` 新增 `getVariable` 方法，允许解构获取全局响应式变量
- 移除 `SiderBar` 组件的 `tip` 提示
- 补充了一些注释

## Fixes

- 修复 `RTable C` 组件对于 `columns type` 项无法有效兼容问题

## 4.7.5

## Feats

- 更新 `vite` 版本至 `5.2.8`
- `appConfig` 配置项
  - 新增 `LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE` 配置项，用于配置路由切换时是否显示内容区域（LayoutContent）加载中状态
  - 新增 `APP_GLOBAL_LOADING` 配置项，用于配置全局加载状态内容
- `setVariable`, `updateSettingState` 方法，使用 `Object.hasOwn` 方法替代 `Reflect.has` 方法
- `spin` 包整合至 `app-components` 下
- `RayLink` 更名为 `AppShareLink`
- `echart-themes` 包整合至 `app-config` 下
- 优化 `GlobalSearch` 底部样式
- `error` 包
  - 整合至 `views` 下
  - `PageResult` 组件新增 `goBack` 功能
- `usePagination` 方法
  - 重写该方法返回值
- 调整 `MenuTag` 标签页尺寸为 `small`
- `RChart` 组件
  - 新增 `onFinally` 配置项，用于配置图表渲染完成后的回调
  - 新增 `watchOptionsThrottleWait` 配置项，可以配置 `watchOptions` 触发频率，当你需要频繁更新图表数据时，可以配置该项，避免频繁渲染图表
  - 移除 `throttleWait` 配置项
- `__test__` 包
  - 新增 `qr-code.spec.ts` 单元测试模块
  - 新增 `modal.spec.ts` 单元测试模块
- 针对 `eslint` 部分规则进行调整
- 补充代码注释

```ts
import { usePagination } from '@/hooks'

const [
  paginationRef,
  { updatePage, updatePageSize, getItemCount, setItemCount },
] = usePagination(
  () => {
    // do something...
  },
  {
    // ...options
  },
)
```

## Fixes

- 修复 `useDayjs.spec` 单测模块测试失败问题

## 4.7.4

对于 `RTable`, `RForm`, `RChart` 组件都新增了对应的 `useTable`, `useForm`, `useChart` 方法；让你在业务开发中抛弃注册 `ref` 实例方式调用组件方法。

补充拓展了 `useModal` 方法，支持 `dad`, `fullscreen` 等拓展配置项。

```ts
import { useTable, useForm } from '@/components'

const [registerTable, { getTableInstance }] = useTable()
const [registerForm, { getFormInstance }] = useForm()

// 做点什么...
```

## Feats

- 更新 `vite` 版本至 `5.2.6`
- `useDevice` 方法支持自定义 `media` 配置项，用于配置自定义媒体查询尺寸
- `RTable` 组件
  - 新增 `tool` 配置项，配置是否显示工具栏
  - 优化工具栏渲染逻辑
  - 新增 `useTable` 方法，用于便捷调用表格方法

> 该方法比起常见的 `ref` 注册，然后 `tableRef.value.xxx` 的方法获取表格方法更为简洁一点。但是也值得注意的是，需要手动调用一次 `register` 方法，否则会报错；还有值得注意的是，需要注意表格方法的调用时机，需要等待表格注册完成后才能正常调用。如果需要在 `Parent Create` 阶段调用，可以尝试 `nextTick` 包裹一层。

```tsx
import { RTable } from '@/components'
import { useTable } from '@/components'

defineComponent({
  setup() {
    const [
      register,
      { getTableInstance, clearFilters, clearSorter, scrollTo, filters, sort },
    ] = useTable()

    const columns = [
      {
        title: 'No',
        key: 'no',
      },
      {
        title: 'Title',
        key: 'title',
      },
    ]
    const data = [
      {
        no: 1,
        title: 'title',
      },
    ]

    return {
      register,
      getTableInstance,
      clearFilters,
      clearSorter,
      scrollTo,
      filters,
      sort,
      columns,
      data,
    }
  },
  render() {
    const { columns, data } = this
    const { register } = this

    return (
      <RTable columns={columns} data={data} register={register.bind(this)} />
    )
  },
})
```

- `RForm` 组件
  - 新增组件，所有行为、方法与 `NForm` 保持一致
  - `useForm` 方法，使用方法与 `useTable` 几乎一致
- `canUseDom`, `isBrowser` 方法统一为函数导出
- `RModal` 组件新增 `useModal` 方法
  - 新增 `useModal` 方法，允许拓展配置 `dad`, `fullscreen` 等配置项。但是由于 `useModal` 生成组件的特殊性，不支持 `memo` 属性配置，其余配置项维持一致
    > 该方法在当前版本存在一个 bug，`preset = card` 时，不能正确的显示 content，查看相应的 [issues](https://github.com/tusen-ai/naive-ui/issues/5746)。
  - 重写部分代码，优化组件逻辑，补全 `ts` 类型
- `RChart`
  - 新增 `useChart` 方法，使用方法与 `useTable` 几乎一致
- 新增 `usePagination` 方法与 `usePagination.spec` 单元测试模块

```ts
import { usePagination } from '@/hooks'

const {
  updatePage,
  updatePageSize,
  getItemCount,
  setItemCount,
  getPage,
  setPage,
  getPageSize,
  setPageSize,
  getPagination,
  getCallback,
} = usePagination(
  () => {
    // do something...
  },
  {
    // ...options
  },
)
```

## 4.7.3

补全 `hooks` 包下的单测模块。

## Feats

- 重命名 `store` 包下的 `type.ts` 为 `types.ts`
- `useElementFullscreen`
  - 优化全屏尺寸逻辑，现在会监听浏览器 `width`, `height` 变化，自动调整全屏尺寸

## Fixes

- 修复 `useElementFullscreen` 方法在退出全屏时，不能恢复原有 `transition` 样式问题

## 4.7.2

新增 `vitest` 测试框架。

重写了一些 `utils`, `hooks` 包的方法，并且编写了对应的单测模块。

## Feats

- 集成 `vitest` 测试框架，并且对于 `utils`, `hooks` 包方法编写了对应的单测模块

> 使用方法请查看 [vitest](https://cn.vitest.dev/)。

```sh
# 新增测试单元模块
1. 在 `__test__` 目录下创建测试文件
2. 添加对应的单测模块
3. 编写对应的单测逻辑

# 值得注意的是
1. 测试文件必须在 `__test__` 目录下
2. 测试文件必须以 `xxx.spec.ts` 或者 `xxx.spec.tsx` 结尾，否则不生效
3. 必须手动补全导入待测试方法或者组件，可以查看现有的测试文件

# 运行测试
pnpm test

# 运行测试 ui 界面
pnpm test:ui

# 最重要需要值得注意的地方
一旦被导入方法或者组件文件中，有报错，那么会导致整个文件的测试方法在执行 `pnpm test`, `pnpm test:ui` 时都报错。

但是单独测试该文件时，不会报错，只有在执行 `pnpm test`, `pnpm test:ui` 时才会报错。

# 最后
未来会逐步完善测试用例，以及编写更多的测试单元模块，包括全局组件。
```

- `basic` 包相关
  - 重构 `equalRouterPath` 方法，现在允许忽略带参数的路径比较
  - `omit`, `pick` 方法不在对 `null`, `undefined` 传参抛出警告；该方法现在支持多参数传递
- `hooks` 包相关
  - `useDayjs`
    - 优化注释
    - `getStartAndEndOfDay` 方法新增 `formatEndOfDay`
- `element` 包相关
  - `colorToRgba`
    - 现在支持解析 `#fff`, `#ffffff`, `#ffffffaa` 格式的颜色
    - 重写该方法
  - `precision` 包相关
    - `Options` 类型重构为 `CurrencyOptions`
    - `format` 方法新增 `currency` 配置项，移除第二个参数，合并在配置项中配置输出格式
    - `distribute` 方法新增配置项（CurrencyOptions）
- 现在 `@/hooks` 包下方法都将构建在一个包中输出，不在做拆分

## Fixes

- `utils` 包相关
  - 修复 `arrayBufferToBase64Image` 方法总是返回 `null` 的问题
  - 修复 `queryElements` 方法 `defaultElement` 配置项不能正确的返回默认值问题
  - 修复 `autoPrefixStyle` 方法不能返回样式本身问题

## 4.7.1

## Feats

- 更新 `vite` 版本至 `5.1.6`
- `vite-plugin-cdn2` 相关
  - 更新 `vite-plugin-cdn2` 版本至 `1.1.0`
  - 更新 `vite.plugin.config.ts` 关于 `cdn2` 配置
  - 新增 `cdnResolve` 方法，自定义 `resolve`
- 更新主流浏览器版本号升级
- `RChart` 组件相关
  - 新增 `intersectionObserver` 配置项，用于配置是否使用 `IntersectionObserver` 监听图表渲染
    > 但是该配置项不支持动态修改，只能在初始化时配置
  - 优化组件的注释，并且补充了一些注释
  - 新增 `intersectionObserver` 配置项，手动指定 `IntersectionObserver` 需要监听的元素
  - `observer` 更名为 `autoResizeObserverTarget`
  - 补充 `chart` 示例页面
- 优化亮色主题下锁屏样式

## Fixes

- 修复 `vite-plugin-cdn2` 插件构建 `echarts` 失败问题，具体查看该 [issue](https://github.com/nonzzz/vite-plugin-cdn/issues/42)
- `RChart` 组件相关
  - 修复卸载组件不能完全清理 `inst` 问题
  - 修复组件不能正常触发初始化动画问题
  - 修正 `isDispose` 方法返回值含义，现在返回 `true` 代表已经卸载，`false` 代表未卸载

## 4.7.0

做了一些核心依赖的升级操作。

并且规范了整个模板的包命名，这个一直算是遗留问题，有些包名不够语意化与有点混乱，现在终于统一了。

## Feats

- `useDomToImage` 相关
  - 优化 `ts` 类型提示
- `usePrint` 相关
  - 现在会强制剔除 `printable` 配置项
- 移除 `rollup-plugin-visualizer` 体积分析插件，使用 `vite-bundle-analyzer` 替换

```sh
# 执行
pnpm report

# 等待构建后，会自动打开浏览器。
```

- 移除 `report` 模式的 `eslint` 检查
- `axios` 相关
  - `BeforeFetchFunction` 类型更名为 `FetchFunction`
  - `AppRawRequestConfig` 类型新增 `__CANCELER_TAG_RAY_TEMPLATE__` 标记，用于标记是否需要可以被取消
  - 优化 `ts` 类型标注
- 将所有 `type.ts` 包重命名为 `types.ts` 符合语义
- 更新 `vueuse` 版本至 `10.9.0`
- 更新 `vite` 版本至 `5.1.5`
- 更新 `vue` 版本至 `3.4.21`
- 将所有 `helper.ts, helper file` 统一更改为 `utils.ts`, `utils file` 方式管理
- 重构 `app/prefixCacheKey` 方法，现在支持自定义前缀
- 优化 `GlobalSearch` 搜索待选项样式
- `__ray-template` 包现在只会在 `__DEV__` 环境下才会做检查
- 新增 `ellipsis` 指令，并且补充所有自定义指令的注释
- `router` 包相关
  - 修改 `router` 注册形式，改为同步注册
  - 修改 `routes` 包导出形式，改为导出一个数组

## Fixes

- 修复 `useVueRouter` 方法 `HMR` 时可能会报错的问题

## 4.6.4

稳定了 `4.6.4` 版本。

## Feats

- 更新 `naive-ui` 版本至 `2.38.1`，详细更细请查看 [CHANGELOG.zh-CN](https://github.com/tusen-ai/naive-ui/blob/main/CHANGELOG.zh-CN.md)
  - 同步更新 `ModalProvider` 在顶层的注入（但是 `resolver` 暂为更新，所以需要手动导入）
- `useI18n` 方法
  - 重写 `overrideLocaleFunc` 方法

## Fixes

- 修复 `useI18n` 方法在 `HMR` 时可能会报错的问题

## 4.6.4-beta1.1

更新了一大波的开发依赖。

## Feats

- 更新 `vue` 版本至 `3.4.20`
- 更新 `vite` 版本至 `5.1.4`
- 更新了开发依赖
- 移除 `utils/xlsx` 工具包与 `xlsx` 依赖
- 更新了 `viteCDNPlugin` 配置形式，现在会自动读取版本号
- 更新 `vue-hooks-plus` 版本至 `1.8.8`
- 更改 `vite-plugins` 包名称为 `vite-helper`

## 4.6.4-beta1.0

更新了核心依赖插件：`vite`, `vue`。

新增 `__ray-template` 包，用于模板启动时的一些检查或者其他钩子的启动。

## Feats

- 更新了一些注释
- 更新 `vue` 版本至 `3.4.19`
- 更新 `vite` 版本至 `5.1.3`；最新版本 `vite` 优化了 `HMR` 逻辑
- 新增检查器功能（存于 `__ray-template` 包），用于在模板启动后，做一些检查工作
- 使用 `checkRightClose`, `checkLeftClose` 方法替换原有检查关闭按钮禁用逻辑
- `useDevice` 方法返回属性 `isTabletOrSmaller` 使用 `readonly` 方法包裹
- `RChart` 组件相关
  - 移除 `animation` 配置项，该配置项在使用的时候可能会有潜在的性能问题
  - 新增 `nextTick` 配置项，是否将渲染图标内容放置到下一个队列中
    > 该配置项启用后，会先渲染一个空的图表，然后在下一个队列中渲染图表内容。这样做的好处是，可以避免一些图表渲染的性能问题，但是会导致图表渲染的时候会有一个空白的过程。
  - 修改 `registerTheme` 方法调用时机，并且该方法仅会执行一次
  - 预设 `Card` 风格的下载功能下拉框预留字段由 `downloadChart` 更名为 `__DOWN_LOAD_CHART__`

## Fixes

- 修复更新主题色时 `preset` 没有被正确更新问题。现在在更新主题色后，会正确的更新 `primaryColorPressed`
- 修复 `README.md` 描述文件中的一些错误描述

## 4.6.3

## Feats

- `GlobalSearch` 相关
  - 取消递归查找，使用 `getRoutes` 方法替代查找，提高查找速度
  - 现在是用快捷键激活搜索框的时候，如果再次按下快捷键并且搜索框已经是激活状态，则不会重新渲染搜索框
- 补充 `resolveOption` 方法注释。在使用该方法的时候，需要开发者自己手动补充当前项的 `fullPath` 字段。因为该方法在处理的时候，并不能准确的感知到当前项的 `fullPath` 字段，所以需要手动补充

```ts
import { useMenuActions } from '@/store'

const { resolveOption } = useMenuActions()

resolveOption({
  // ...your option
  fullPath: '/your path',
})
```

- 优化 `GlobalSearch` 组件样式
- `addStyle` 方法相关
  - 方法重写并且更名为 `setStyle`
  - 支持自动补全内核前缀
  - 支持识别样式变量（css var）方式插入
  - 支持字符串数组形式插入样式
- `queryElements` 方法支持默认值配置项
- `addClass` 相关
  - 方法更名为 `setClass`
  - 支持数组传参
- `hasClass`, `removeClass` 方法支持数组传参
- 补充 `pick`, `omit` 方法类型重载
- `menu store` 相关
  - 新增 `depthSearchAppMenu` 方法，用于深度搜索菜单，并且该方法会缓存上一次的搜索结果
- 新增 `isAsyncFunction` 方法，用于判断是否为 `async` 函数

```ts
import { depthSearchAppMenu } from '@/store'

const result = depthSearchAppMenu(appMenuOptions, 'target fullPath')
```

- `useBadge` 相关
  - 使用 `depthSearchAppMenu` 方法替代原查找方法
  - 将 `equal` 方法提取到 `utils` 包中，并且更名为 `equalRouterPath`，用于判断两个路径是否相等

## Fixes

- 修复 `SettingDrawer` 组件某些开关不能正确同步状态问题
- 修复 `usePrint` 方法在 `unrefElement` 方法获取失败后不执行的问题。在 `print-js` 逻辑中，如果未获取到 `dom`，会视为其他的打印方式，不符合 `print-js` 的设计
- `isPromise` 方法修正，现在会正确的识别 `async` 标记d的函数

## 4.6.2

## Feats

- `AppMenu Extra` 已经稳定发布，现在你可以在菜单标题后面添加标记了，相关变更
  - `extraIcon` 类型变为 `VNode`
  - 新增 `show` 配置项，用于配置是否显示 `extra` 标记，如果默认为 `false`，则不会显示 `extra` 标记，如果未配置或者配置为 `true`，则会显示 `extra` 标记。意味着只要你配置了 `label` 则会显示标记
  - 新增 `useBadge hooks` 方法，便捷操作菜单标记
    - `update`：更新标记
    - `show`：显示标记
    - `hidden`：隐藏标记
  - 新增 `i18nLabel` 配置项，当你希望该标签能够跟随模板语言切换动态切换的时候你可能用的上，该配置项优先级高于 `label`

> 该配置项仅在 `collapsed` 为 `false` 时生效。

- 更新 `axios` 版本至 `1.6.7`
- 移除 `matchMenuOption` 方法
- 调整 `vueRouterRegister` 方法的运行时机，现在会在 `router` 注册完成后再执行该方法
- 优化一些试例页面代码
- `RTable` 相关
  - 新增 `Props` 组件，支持勾选配置一些表格的配置项，目前仅支持：边框、条纹
  - 优化 `Size` 组件，取消没必要的响应式代理数据
  - 取消自定义工具组件的 `Popover` 提示
  - 更改 `config.ts` 文件名为 `shared.ts`，并且 `config` 配置导入导出方式更改为 `import { config } from '@/shared'`
- 更改 `README-ZH.md` 文件名为 `README.zh-CN.md`

## 4.6.2-beta1.2

## Feats

- 优化 `AppMenu Extra` 标记样式，现在不会因为菜单标题过长将标记挤出去
- 优化 `RQRCode` 组件样式，在 `error` 状态下会模糊显示二维码

## Fixes

- 修复 `close` 方法会关闭最后一个标签的问题，现在如果当前的 `getMenuTagOptions` 长度为 `1`，则不会关闭标签页

## 4.6.2-beta1.1

## Feats

- `cache` 工具包相关
  - 优化 `removeStorage` 方法类型推导，当 `key` 为预留字关键字时，强制绑定 `storageType` 为对应的类型值

```ts
import { removeStorage } from '@/utils'

// 正确
removeStorage('__all__', 'all')
removeStorage('__all_sessionStorage__', 'sessionStorage')
removeStorage('__all_localStorage__', 'localStorage')
remove('your key', 'sessionStorage' || 'localStorage')

// 错误
removeStorage('__all__', 'sessionStorage')
removeStorage('__all_sessionStorage__', 'localStorage')
removeStorage('__all_localStorage__', 'all')
removeStorage('__all_localStorage__', 'sessionStorage')
remove('your key', 'all')
```

- 优化 `Layout` 布局样式，移除 `border` 边框，添加 `box-shadow` 阴影

## Fixes

- 修复 `copy` 指令复制的时候不能正确的提示的问题
- 修复 `AppVersionProvider` 组件不能正确的注入 `appVersion` 的问题

## 4.6.2-beta1.0

为了支持同域名下同时部署多套系统，重构了 `cache` 工具包支持前缀配置。并且暴露重构所有的缓存 `key` 配置项，为了便捷的进行私有数据缓存。

## Feats

- 更新 `vue` 版本至 `3.4.15`，核心性能优化更新
- `cache` 工具包相关
  - 重构 `getStorage` 方法，支持前缀配置
  - 重构 `setStorage` 方法，支持前缀配置
  - 重构 `hasStorage` 方法，支持前缀配置
  - 重构 `removeStorage` 方法 - 支持前缀配置 - 更新预留 `key`，现在更新为：`__all__`, `__all_sessionStorage__`, `__all_localStorage__`

> 默认不启用该功能，如果需要启用，可以在调用 `cache` 包方法的时候手动配置 `prefix` 属性为 `true`，默认会读取 `prefixKey` 配置项，如果未设置则会尝试读取 `APP_CATCH_KEY_PREFIX`。并且 `useStorage` 之类的第三方工具库并未集成该方法。

- 暴露所有缓存 `key`，允许自定义所有缓存 `key`
- `designConfig` 配置相关
  - `appNaiveUIThemeOverrides` 配置项支持按照 `dark`, `light` 两个主题分别配置
  - 新增 `appNaiveUIThemeOverridesCommon` 配置项
- 优化 `GlobalSearch` 组件样式
- 更新搜索按钮样式，由图标变为按钮样式（`GlobalSearchButton`）
- 更新 `appThemeColors` 色盘
- `hasMenuIcon` 更名为 `createMenuIcon`
- 默认绑定过渡动画更改为 `scale`
- 更新内容区域背景色（`$layoutContentBackgroundColorDark`、`$layoutContentBackgroundColorLight`）
- 更新底部区域背景色（`$layoutFooterBackgroundColorDark`、`$layoutFooterBackgroundColorLight`）
- `RouteMeta` 配置项相关
  - 新增 `extra` 配置项，用于配置标记

```ts
import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const cacheDemo: AppRouteRecordRaw = {
  // ...your route config,
  meta: {
    // ...other meta config,
    extra: 'new',
  },
}

// 当然你也可以配置 extra 为一个对象

AppMenuExtraOptions {
  extraLabel?: string
  extraIcon?: string | VNode
  extraType?: TagProps['type']
}

const cacheDemo: AppRouteRecordRaw = {
  ...your route config,
  meta: {
    ...other meta config,
    extra: {
      extraLabel: 'new',
      extraIcon: 'icon' || <Icon />,
      extraType: 'primary' || 'success' || 'warning' || 'error' || 'info' || 'default',
    },
  },
}
```

## Fixes

- 修复 `naive-ui` 修改主题色不能准确的同步到全局的问题

## 4.6.1

## Feats

- 更新 `vite` 版本至 `5.0.11`
- 更新 `@vitejs/plugin-vue` 版本至 `5.0.3`
- `maximize` 方法 `options.scrollToOptions` 配置项现在仅在放大状态才会生效
- 更新 `AppVersionProvider` 版本刷新逻辑
- `axios` 相关
  - `cancelConfig`
    - `needCancel` 配置项变更 为 `cancel`
- `icons` 相关
  - 变更 `reload` 图标
  - 变更 `expanded` 图标
- 路由切换过渡动画优化，新增两个新过渡动画。默认绑定过渡动画更改为 `fade-slide`
- `app-config` 暴露 `CONTENT_TRANSITION_OPTIONS` 配置项，用于配置路由切换过渡动画
- 变更 `regexConfig` 配置项 `validCSSUnit` 为 `cssUnit`
- 调整 `reload` 方法位置，现在调整为在 `MenuTag` 栏

## 4.6.0

破坏性更新，请谨慎更新。

提升了模板整体性能。

## Feats

- 更新 `vue` 版本至 `3.4.14`
- `naive-ui` 相关
  - 更新 `naive-ui` 版本至 `2.37.3`
  - 更替 `naive-ui` `cdn` 为 `https://cdnjs.cloudflare.com/ajax/libs/naive-ui/2.37.3/index.prod.js`
  - 使用 `NFlex` 组件替换 `NSpace` 组件，查看 [官方文档](https://www.naiveui.com/zh-CN/dark/components/flex)
- 更新最新版本 `vue` 后，更新 `createDiscreteApi` 方法注册上下文，改为函数包裹，避免 `slot default invoked outside of render` 警告
- `menu store` 相关
  - 优化 `setupAppMenu` 方法，初始化时会拼接完整的 `fullPath`，避免 `url`, `menu value` 更新路由时重复处理 `path`，提高性能
  - 优化 `updateMenuKeyWhenRouteUpdate` 方法，减少 `path` 处理操作
  - 优化 `changeMenuModelValue` 方法，减少 `path` 处理操作
  - 移除 `emptyMenuTagOptions` 方法，使用 `spliceMenTagOptions` 方法替代
- 由于更新了 `path` 逻辑，所以 `menu store`, `AppMenu` 等相关也同步更新
  - `AppMenu` 更新 `key` 绑定字段为 `fullPath`
  - `menu store` 更新 `menuKey` 绑定字段为 `fullPath`
  - 更新 `parseAndFindMatchingNodes` 绑定字段为 `fullPath`
- `useAppNavigation` 相关
  - `navigationTo` 相关
    - 重构该方法
    - 支持传递完整路径跳转
    - 支持传递参数 `vue-router query` 对象
    - 支持配置项，详情请看 `NavigationToOptions`
- `useSiderBar` 相关
  - 同步更新所有方法，使用 `fullPath` 代替 `path`
- `useContextmenuCoordinate` 方法
  - 使用 `readonly` 方法包裹 `show` 属性
  - 新增返回 `updateShow` 方法，允许手动更新 `show` 属性
  - 新增 `options` 配置项 `clickOutside` 方法，允许配置点击元素外部区域的回调函数
  - 更新对应 demo
  - 补充一些注释
- 统一 `app-config` 的导入导出方式，现在统一为 `import { xxx } from '@/app-config'` 导入
- 统一 `hooks` 包的导入导出方式，现在统一为 `import { xxx } from '@/hooks'` 导入
- `app-config` 相关
  - 开放 `APP_CATCH_KEY.appMenuKey` 属性，配置缓存读取字段
- `useMaximize` 相关
  - 优化 `maximize` 方法，现在支持配置滚动位置
- `cfg.ts` 相关
  - `cfg.ts` 更名为 `vite.custom.config.ts`
  - `cfg.ts` 类型包更名为 `viteCustomConfig.ts`
- 由于 `cdn.staticfile.org` 停止服务，所以切换至 `cdnjs`

## Fixes

- 修复 `RChart` 组件 `RChartInst` 类型不完整的问题
- 修复读取默认缓存语言的时候没有正确使用 `APP_CATCH_KEY.localeLanguage` 的问题
- 修复 `RTable` 全屏没有正确弹出提示信息问题
- 修复面包屑 `fullPath` 在平级模式下追加时为绑定问题
- 修复 `closeAll` 方法在特殊情况下不能正确的关闭标签页并且跳转至 `root path` 的问题

## 4.5.0

破坏性更新。

更新 `vue` 版本至 `3.4.0`，请查看相关变更：[Vue 3.4.0](https://github.com/vuejs/core/blob/main/CHANGELOG.md)。该版本破坏性更新了一些东西，例如：

- `JSX` 命名空间默认移除
- `ReactiveTransform` 移除
- `v-is` 指令移除

更新 `@vitejs/plugin-vue` 版本至 `5.0.0`，请查看相关变更：[vite-plugin-vue](https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/CHANGELOG.md)。该版本破坏性更新了一些东西，例如：

- 放弃 `ReactivityTransform` 支持
- 放弃 `node14, 16` 版本支持
- 放弃 `vite4.x` 版本支持
- 弃用 `defineModel` 配置，`vue3.4.0` 版本该功能已经稳定

解决 `sameLevel` 问题与核心包 `store/men` 的一些问题。提高了性能，避免了潜在的空引用问题。

是统一 `types` 包的导入导出行为。

## Feats

- 统一 `types` 包下的导出方式，现在统一为 `import type { xxx } from '@/types'` 导入
- `RQRCode` 组件
  - 在 `loading` 状态下会模糊显示二维码，并且展示 `loading` 状态
  - 优化显示 `error` 状态下默认按钮样式
- 更新 `README.md`, `README-ZH.md` 文档
- 取消 `changeModelValue` 节流锁
- 优化 `changeModelValue`, `updateMenuKeyWhenRouteUpdate` 方法，避免潜在的空引用问题
- 插件相关
  - 更新 `vue` 版本至 `3.4.0`
  - 更新 `@vitejs/plugin-vue-jsx` 版本至 `3.1.0`
- `RModal` 组件相关
  - 新增 `memo` 配置项，用于配置是否记忆上一次的位置
- `RChart` 组件
  - 补充部分注释
  - 新增 `isDispose` 方法，检测当前图表是否被卸载
- 新增 `AppVersionProvider` 注入器，用于注入 `appVersion` 全局变量，检测是否需要重新加载页面

## Fixes

- 修复初始化的时候面包屑为空的问题
- 修复 `sameLevel` 平级模式面包屑追加问题
- `RModal` 组件
  - 修复初始化配置 `show = true` 时，`dad` 属性不生效的问题

## 4.4.7

## Feats

- 更新 `vue` 版本至 `3.3.13` 版本
- 更新 `naive-ui` 版本至 `3.36.0`。新增了几个新组件
- 更新 `vite` 版本至 `5.0.10`
- `appConfig` 相关
  - 移除 `APP_WATERMARK_CONFIG` 配置项，现在水印配置项会被 `watermarkConfig` 替代
  - 移除 `ROOT_ROUTE` 配置项，现在根路由配置项会被 `appRootRoute` 替代
- `variable` 相关
  - 移除 `variable` 管理 `ROO_ROUTE` 配置项
- `commit-message` 新增 `plugin` 更新相关前缀配置
- `RQRCode` 组件
  - 调整 `loading` 透明度
  - `downloadQRCode` 方法将会返回一个 `Promise` 对象
- `basic` 包
  - `downloadAnyFile` 方法将会返回一个 `Promise` 对象
- `types` 包
  - 新增 `ReturnPromiseType` 工具类型，用于获取函数返回值的 `Promise` 类型
  - 新增 `ConditionalExclude` 工具类型，用于条件排除指定类型

## 4.4.6

## Feats

- `vite` 配置项
  - `cdn`
    - 移除不能被 `cdn` 引入的包配置
- 移除 `vue-demi` 本地包依赖，仅在 `cdn` 引入。因为某些插件依赖改包

## Fixes

- `hooks` 相关
  - `UseDomToImageOptions` 方法
    - 修复 `options.imageType` 必填的错误
    - 修复该方法在执行失败时，没有正确的返回错误状态与执行错误钩子方法。现在在执行失败或者获取未正确获取到元素的时候，会返回 `Promise.reject` 状态，并且会执行 `createdError` 钩子方法
    - 修改 `createdError` 钩子方法回调参数类型
    - 修改 `created` 钩子方法回调参数类型
    - 修复 `finally` 方法不能正确执行的问题
- `utils` 相关
  - `printDom` 方法
    - 新增配置项 `base64` 为 `true`
    - 修改 `printOptions` 类型，剔除 `base64` 属性，因为该配置项始终应该为 `true`，即使你手动配置为 `false`，也会被强制转换为 `true`
- `components` 相关
  - `RTable`
    - 修复打印的时候，可能会出现颜色不正确的问题
    - 现在打印的时候，会将整个表格（包括：表头、表格、表格分页、表格底部区域）全部打印

## 4.4.5

## Feats

- 切换 `cdn` 源至 `https://www.staticfile.org/`
- 更新 `vue` 版本至 `3.3.11`

## 4.4.4

升级 `vite` 版本至 `5.0.8`。提升构建速度，并且消除了烦人的 `terser` 警告（未配置该项都会被警告，确实很烦）。

现在能自动的根据 `main` 分支更新构建发布了。

新增 `pre-commit` 检查。现在在提交代码前，会自动检查代码规范，如果不符合规范则会阻止提交。

## Feats

- 更新 `vite` 版本至 `5.0.8`
- `tsconfig` 文件 `compilerOptions.moduleResolution` 选项由 `Node` 改为 `bundler`
- `utils` 包相关改动
  - 统一导出、导入行为，现在统一使用 `import { xxx } from '@/utils'` 导入
  - 剔除 `basic 包 print` 方法，现在使用 `utils/dom` 包中的 `usePrint` 替代
  - `utils/dom` 包相关细节
    - 新增 `printDom` 方法，取代直接调用 `print-js` 方法调用打印。该方法会先将 dom 转换为 `base64` 再调用 `print-js` 方法，避免一些诡异问题。`RTable` 组件打印功能已经由该方法重写。并且可以配置 `printDom` 方法的所有参数，细节请查看 `PrintDomOptions` 类型
  - `utils/element` 包中一些方法，改为 `effectDispose` 方法注销 `effect`
- `husky` 相关
  - 新增 `commit-msg`, `common.sh` 文件，用于检查 `commit` 信息
  - 新增工作流程，自动构建发布
- `alias` 别名相关
  - 移除 `@use-utils` 别名
  - `@use-images` 更改为 `@images`
  - `@use-api` 更改为 `@api`
- `hooks` 包相关
  - 新增 `usePrint` 方法，允许 ref dom 直接调用打印
  - 新增 `useDomToImage` 方法，用于直接输出 dom 为 `base64`, `blob` 等
- `components` 包相关
  - `RTable` 打印时，如果未手动配置 `documentTitle` 属性，则会自动获取 `title`，如果 `title` 属性为 `string` 类型，则会默认使用该值作为 `documentTitle` 属性。但是如果未获取到 `title` 并且未配置 `documentTitle` 属性，则会默认的将 `documentTitle` 赋值为 `''`，也就是说默认输出浏览器标题
- 移除 `ReactiveTransform` 所有支持
- 相关插件更新
  - `pinia` 版本更新至 `2.1.7`
  - `vue-router` 版本更新至 `4.2.5`
  - `interactjs` 版本更新至 `1.10.26`
  - `axios` 版本更新至 `1.6.2`
- `Echarts Themes` 更新背景色默认为 `transparent`。如果需要更新配置，只需要在配置 `options` 时增 `backgroundColor` 属性即可

```ts
const options = {
  backgroundColor: 'your color',
  ...your options
}
```

## 4.4.3

更新 `vue` 版本至 `3.3.10`。

补充了一些代码的注释（慢慢还账-，-）。

## Feats

- 更新 `vue` 版本至 `3.3.10`
- 新增 `useElementFullscreen` 方法，用于全屏元素。但是该全屏区别于浏览器全屏元素，仅是网页全屏效果
- 使用 `useElementFullscreen` 方法重构 `maximize` 方法
- `changeMenuModelValue`
  - 现在方法支持第三个参数配置跳转时，是否携带参数
  - 避免递归查找的时候，一些不必要的操作，优化性能
- 核心模块 `Menu` 的优化细节
  - 使用 `router.getRoutes` 方法替代以前的递归查找（`updateMenuKeyWhenRouteUpdate` 方法）
  - 优化当菜单更新时、url 地址更新时都会重复检查的问题，现在检查是惰性的

## Fixes

- 修复了通过 `url` 携带参数跳转页面，参数可能会被拦截并且丢失的问题
- 修复了 `url` 跳转页面导致多次更新的问题

## 4.4.2

这是一个具有破坏性更新的版本，如果你使用了该模板，那么你需要做一些改动。

详细拆分 `hooks` 包的方法。以前的划分方式不太合理，所以进行了一次大的重构。并且新增了一些方法。现在按照方法功能进行分包，更加详细。

剔除 `h` 函数渲染，因为该方法不会受到 `vue` 的编译优化。

针对 `MenuTag` 的定位滚动效果做了优化，现在滚动效果更加平滑。

补充了一些代码的注释（慢慢还账-，-）。

### Feats

- 重新划分 `hooks` 包，按照功能进行拆分，并且新增一些包
  - `useAppMenu` 方法更名为 `useAppNavigation`
  - `useMenuTag` 方法更名为 `useSiderBar`
  - `useRootRoute` 方法更名为 `useAppRoot`
  - `useMainPage` 包移除
  - 新增 `useMaximize`, `useSpinning`, `useTheme`, `useWatermark` 方法
  - 新增 `components` 包，用于存放模板二次封装组件、`NaiveUI` 组件的一些 `hooks` 方法
  - 每个方法包导出对应的 `ReturnType` 类型
- `Breadcrumb` 组件新增过渡效果，现在切换路由时会有过渡动画，视觉效果更友好
- 移除 `getVariable` 方法
- 移除 `utils/element` 包部分方法
  - `on`
  - `off`
- 移除 `changeSwitcher` 方法，使用 `updateSettingState` 方法代替
- `useContextmenuCoordinate` 方法支持配置项
- `MenuTag` 的定位滚动现在支持过渡效果

## Fixes

- 修复 `setRootRoute` 方法执行时提示只读错误导致不能正常修改的问题

## 4.4.1

更新 `vite` 版本至 `5.0.4`。同步修复了一些小问题。

基础性能优化，根据开发模式与构建模式拆分插件启用。避免某些仅仅需要在构建模式的插件在开发模式下也被启用。

新增预构建插件列表。

### Feats

- 补充 components 包组件的 `props` 类型导出
- 补充 `__DEV__` 全局变量
- 优化 `precision` 包中的基本运算方法，并且将小数点默认保留 `8` 位
  - 新增 `isCurrency` 方法检测是否为 `currency.js` 对象
- 按照构建模式与开发模式拆分插件启用
- 新增预构建列表

## Fixes

- 修复 `i18n fallbackLocale` 错误配置为 `SYSTEM_DEFAULT_LOCAL` 的问题
- 修复 `SYSTEM_DEFAULT_LOCAL` 类型定义错误问题

## 4.4.0

补充了几个组件。并且更改了组件的导入、导出方式，由从前很恶心的一个个导入，变为 `import { RIcon } from '@/components'`。

替换了过时的 `nvm`，使用 `fnm` 替代，并且配置了一些文件让你能够自动切换 `node` 版本，前提是你也装了对应的插件。

由于 `WebStorm` 一直提示可以缩短路径，强迫症患者表示受不了了，就全部改了（可能遗漏）。

升级 `node` 版本至 `18.18.2`。

### Feats

- 新增组件
  - RModal
    - width：配置 modal 宽度
    - cardWidth：配置 preset 为 card 的宽度
    - dialogWidth：配置 preset 为 dialog 的宽度
    - fullscreen：配置 preset 为 card 并且配置 fullscreen 为 true 则可以获得全屏效果
    - dad：启用拖拽效果。仅在 preset 为 card, dialog 时生效（基于 interactjs 实现）
- 修改 `components` 包组件的导出方式，也修改组件的使用方式
- 新增 `layoutContentSpinning` 全局属性，用于管理加载动画效果。区别于 `globalMainLayoutLoad` 会强制刷新页面，该属性仅会触发加载动画。并且基于该属性拓展 `openSpin`, `closeSpin` 方法
- 更新 `vite` 版本至 `5.0.2`

### Fixes

- 修复国际化切换，由于字段的错误配置导致缓存一直提示 `Fall back to translate` 的问题
- 修复锁屏不能正常打开、关闭的问题

## 4.3.4

更新了 MenuTag 的样式，现在有更加细腻的过渡动画。

针对 `utils` 下的方法，修复 `utils/element` 中的部分方法因为 `ref` 注册 `dom` 的时候不能正确的触发方法的问题。并且修复了部分方法类型的不准确问题；补充了一些示例。

由于 vite 不再支持显式声明 .env=production 配置文件 NODE_ENV=production，所以该版本移除了配置文件的 NODE_ENV 声明。

修复构建提示循环依赖问题。

### Feats

- 更新了 MenuTag 的动画效果
- 基于 `print-js` 与 `vue hooks` 开发新 `print` 方法，存放于 `utils/basic`
- 移除 .env.production 文件的 NODE_ENV 显式声明
- 优化构建 chunk

### Fixes

- 修复 `utils/element` 方法不能正确获取 `ref` 绑定 `dom` 的问题
- 修复设置界面抛出只读警告问题
- 修复构建提示循环依赖问题

## 4.3.3

紧跟尤大大脚步，更新 `vite` 版本至 `5.0.0` 版本！与此同时，更新了配套所有插件！

更新 ROOT_ROUTE 的一些使用方法，该配置方法与原有的方式不变，但是有一个新的功能点则是，该配置项会传递给 global-variable 的 globalRootRoute 属性。并且更改模板原有获取 path 的方法，改为响应式获取。当你要进行动态的维护 Root Route 的时候，该方法可能可以帮助到你 `useAppRoot`。

如果你在更新版本后出现一些奇奇怪怪的问题，不要犹豫，直接删除 `node_modules` 后再重新安装依赖，这是缓存导致的问题。

### Feats

- 更新 `vite` 版本至 `5.0.0`
- 升级所有配套插件
- 升级 ROOT_ROUTE 配置与使用

### Fixes

- 修复不能正确关闭标签页问题
- 修复不能正确识别是否能关闭标签页问题
- 修复 `closeAll` 方法导致标签页闪烁问题
- 修改 useVueRouter 注册时机，避免该方法使用的 HMR 报错问题

## 4.3.2

升级 `vue` 版本至最新 `v3.3.8`。

更新了 appConfig 的一些类型，类型定义不再那么的宽泛。

新增 `useAppSetting hook`，区别于其他的模板方法，该包中的方法，可以用于全局任意页面。该方法相当是对于 `useSettingStore` 包中方法的补充。

### Feats

- `useMenuTag` 所有关闭方法，都支持了多种参数类型传递方式。并且 `closeRight`, `closeLeft` 方法能够正确的关闭标签页
- `useDayjs` 新增一些常用方法
- 新增 `appExpandRoutes` 变量，存放展开、提升后的路由
- `scopeDispose` 重命名为 `effectDispose`
- 优化 maximize 方法，并且支持配置层级。默认层级 99
- changePrimaryColor 方法支持自定义透明度

### Fixes

- 修复 LayoutContent 全屏时候在手机浏览器打开高度显示不正确问题
- 修复 MenuTag 菜单报错问题

## 4.3.1

根据反馈，尽可能的补充了一些代码注释。

### Feats

- 标签页右键菜单新增关闭当前页功能，优化了文案
- `utils/basic` 包中的部分方法改为 effect 执行逻辑，避免使用 ref 注册的 dom 不能正确的被获取的问题
- 新增 `effectDispose`, `watchEffectWithTarget` 方法
- `utils/cache` 新增 `hasStorage` 方法
- 现在标签页会缓存，不再随着刷新后丢失
- 新增 maximize 方法，并且基于该方法实现 LayoutContent 全屏效果

### Fixes

- 修复标签页右键菜单闪烁问题

## 4.3.0

提供了专用于一些模板的 `hooks`，可以通过这些方法调用模板的特定功能。并且该功能后续是模板维护的重点。

改造 `pinia` 使用方式，统一使用 `xxxGetters`, `xxxActions` 去调用仓库数据与方法。

### Feats

- 新增 `store/hooks` 包
- 新增 `hooks/template` 包

## 4.2.9

主要更新了命名问题。并且使用单词检查器，扫描整个项目替换了拼写错误的单词。

### Feats

- setVariable 方法新增回调函数参数
- 优化 getVariable ts 类型提示，并且使用 readonly 方法包裹
- 重命名 globalVariableToRefs 为 getVariableToRefs，并且使用 readonly 方法包裹
- renderNode 方法新增对于 Slot 类型参数支持
- 新增 BasicTypes 类型
- 提取 RIcon 组件 props 单独维护
- 将 api 管理，提取到 `src` 下维护
- getAppLocalMessages 获取路径方式由相对路径改为绝对路径
- 将 hooks 包中的 variable 方法提取至 `src` 下管理，并且更改名称为 `global-variable`
- 调整 GlobalSearch 样式

### Fixes

- 修复 downloadBase64File 下载后不能正常移除 `a` 标签问题
- 修复 downloadAnyFile 存在的可能未加载完成而提前执行方法的问题

## 4.2.8

我好像犯了一个很愚蠢的错误，那就是使用 useFullscreen 方法的时候总是会弹出提示。所以紧急修复了这个很愚蠢的问题，并且移除了这个方法。

在兼容移动端后，手机打开页面会触发缩放情况，这个版本禁用了缩放。如果有需求可以去设置 `index.html` 中的 `meta` 标签。并且优化了移动端的锁屏样式。

重构了 RChart 组件，因为该组件过于单调，所以决定赋予更多的功能。结合 naive NCard 组件进行了二次封装。当然你也可以通过设置 `preset = default | null | void 0` 调用无预设样式的 chart 图表。

### Feats

- 移除二次封装 useFullscreen 方法
- 禁用自动缩放
- 优化移动端锁屏样式
- 禁用 vue-i18n 自动导入
- RChart
  - 新增 preset 属性配置，以下配置属性仅在 preset 为 card 生效
    - 新增 downloadOptions 下载图片配置，具体说明查看文档：https://echarts.apache.org/zh/api.html#echartsInstance.getDataURL
    - 修改 RChart 渲染时机，更改为主进程渲染
    - 新增 cardExtra slots 自定义配置操作栏
    - 新增 title 属性
    - 新增 onDropdownSelect 回调方法
- 新增 renderNode 方法，用于减少 if else 表达式渲染 vnode
- 语言包新增 globalMessage 模块，用于配置统一的输出消息

### Fixes

- 修复每次执行 useFullscreen 都弹出提示的问题
- RChart
  - 修复 animation false 状态渲染异常问题
  - 修复响应式代理 echart instance 时，导致部分方法异常问题

## 4.2.7

主要是做了一些统一命名的事情，以前由于写的比较放浪形骸现在正在慢慢更改这个大问题。

### Feats

- 优化顶部操作栏的渲染逻辑，现在将更加合理的管理数据渲染图标
- 二次封装 useFullscreen 方法，如果当前环境不支持全屏则会自动弹出提示
- 重命名 utils/hook 包名为 basic
- 移除 vuedraggable 插件
- RequestCanceler 方法部分属性与方法变为私有
- 重命名 layout 包下的一些组件 name
- 升级 echarts 至 5.4.3 版本

## 4.2.6

### Feats

做了一点大的更新改动，支持小尺寸设备、显示器展示了。但是仅仅是在布局上做了一些兼容！

补充了一些代码的注释。

- RChart 改动
  - 重构了 RChart 组件，现在支持自定义主题色了
  - 支持配置 theme 为 default 属性，则可以启用 echart 默认样式
  - 更新了 echart-themes 包中的说明文件
- 更改 canceler 方法名为 RequestCanceler
- 更改 app-config 包中的一些属性命名，现在将更加统一命名规则

### Fixes

- 修复 axios request error 状态时不能正确取消拦截器问题

## 4.2.5

### Feats

- 同步更新 vue 版本至 v3.3.6
- RChart 组件相关改动
  - RChart 主题配置提取至 src/echart-themes 包中管理。添加方式和规则不变
  - 调整 RChart setupChartTheme 运行时机，现在不会重复运行该方法获取主题
- 新增 AppWatermarkProvider 组件与 appConifg APP_WATERMARK_CONFIG 相关配置项
- 新增 AppMenu 激活、hover 样式
- 新增 RMoreDropdown 组件，基于 NDropDown，默认以 `...` 展示下拉，允许自定义图标

### Fixes

- 紧急修复构建 cdn vue-demi 依赖丢失问题

## 4.2.4

### Feats

- 优化 utils/element 包下的方法
- 更新 vue-hooks-plus 版本至 1.8.5
- 移除不必要的 cdn
- 优化了类型包的一些基础类型，剔除了一些无意义的类型
- 提取 RChart props 单独维护
- RTable 组件新增 onContextmenu props 属性。用于在启用右键菜单时被组件强行代理右键点击事件的回调

### Fixes

- 修复 RChart 组件不能被正常取消 watchOptions 问题

## 4.2.3

### Fixes

- 修复 RQRCode 组件不能正确的监听 text 属性变化而重新渲染问题

## 4.2.2

重构了 RTable 组件。优化表格渲染逻辑，解决旧组件重复渲染问题。并且允许自定义拓展工具栏。

为了项目未来的可维护性，将 hook 库自动导入方法移除。应该尽量避免滥用 `auto import`，否则项目规模庞大后，带来的项目可维护性是一个负担。

新增了一个新的 `eslint` 规则，并且约定变量初始化的时不明确具体值时，尽量使用 `null` 或者 `void 0` 的方式进行赋值。而不是直接使用 `undefined` 直接赋值。

### Feats

- 优化 `RChart` 组件
- 设置 `README.md` 默认为英文
- 优化了一些错误类型的提示，现在报错信息会更加的详细、准确
- 实现了新的文件下载函数 `downloadAnyFile`，支持 `blod, file, base64, arrayBuffer`
- 更新 `naive-ui` 版本至 `2.35.0`
- 新增了一些工具类型与工具方法
- 移除 screenfull 插件，使用 vueuse useFullscreen hook 替代。
- 新增规则 `no-undefined`，[点击查看](https://eslint.org/docs/latest/rules/no-undefined#rule-details) 具体规则

```ts
// 错误示例
const demo = undefined

// 正确示例
const demo = void 0
const demo2 = null
```

### Fixes

- 修复全屏不能正确提示状态问题

## 4.2.1

经过综合考虑，还是给模板增加 `cdn` 的配置。基于 `vite-plugin-cdn2` 插件实现。

### Feats

- 指令相关
  - `v-copy` 指令将使用 `String` 强制转换传入的值
  - 统一暴露节流、防抖指令的配置项类型 `import type { DebounceBindingOptions, ThrottleBindingOptions } from '@/directives/type'`
  - 现在 `v-disabled` 指令生效时会降低一点元素的亮度
- `changeMenuModelValue` 方法添加节流锁，避免重复刷新 url 导致的一些问题
- 新增 `cdn`，缩减构建体积。如果不需要该配置，搜索 `viteCDNPlugin` 注释即可

## 4.2.0

针对分包，做了全局的重新设计、调整。让包的名称更加语义化；最重要的是，重新抽离了一些全局可能常用的方法，例如：useI18n、useDayjs 等，在以前这些方法存放于对应的包中，其实这样很不合理，所以现在统一存放于 `src/hooks` 包中。并且该包以后统一存放 `hooks` 方法，并不是 `utils` 方法，做了一个本质的区分，所以 `xxxCopilot.ts` 文件中的方法并不会移动，维持存放在原有的模块下。

引入 `useGlobalVariable` 来管理全局变量。与 `pinia` `的使用场景不同，useGlobalVariable` 是用于引入一些全局的响应式变量，这些变量不需要缓存，也不依赖任何插件。一个典型的应用是实现 `GlobalSpin`。使用该方法时，请谨慎使用，避免滥用，因为这些变量会被全局缓存且无法被回收。该方法存放的值，暂不支持缓存（如果有需要，可能后期会增加该功能）。

当项目插件或者需要配置项过多时候，会导致 `vite.config.ts` 文件变得异常臃肿。所以，在本次更新中，将插件的配置单独提出维护（`vite.plugin.confit.ts`）。系统的常用配置依旧在 `cfg.ts` 文件中。所以默认情况下，一般不需要修改 `vite.config.ts` 文件。

### Feats

- 新增 `useGlobalVariable` 管理全局变量（该变量可以是在注册插件之前被调用）
- `v-disbaled` 指令现在会尝试给元素添加 `disabled` 属性，如果该属性生效的话
- 注册指令操作现在不会中断程序执行，但是会抛出错误警告
- 抽离 `vite.plugin.confit.ts` 维护项目启动所需插件

## 4.1.9

### Feats

- 新增 RayQRCode 组件（二维码）
  - 基于 awesome-qr 封装，继承其所有特性。并且拓展 状态、下载、自动更新等属性
  - 自动卸载于释放内存，仅需要关注 text 内容填充
- 移除 qrcode.vue 依赖
- 更新 vue-hooks-plus 版本至 v1.8.2
- 移除 office 功能集成
- 统一包命名方式
- 更改 v-copy 实现细节（使用方式不变）

### Fixes

- 修复了一些小细节问题

## 4.1.8

### Feats

- 更新 `vite` 版本至 `v4.4.9`
- 更新 `vue-hooks-plus` 版本至 `v1.8.1`
- 更新了 RayTable 的一些事件的命名
- `RChart` 组件做了一些调整
  - 支持指定 observer 监听对象，默认为 chart 组件本身
  - 默认开启 autoChangeTheme 功能
  - 支持配置 throttleWait 节流等待时间，默认 500ms
  - 支持通过配置 `desginConfig.echartTheme` 属性指定 `echart theme`。并且只需按照约定方式注册的主题，只需要指定主题名称，即可完成 `light` `dark` 两种主题指定
  - RChartInst 新增 dispose render 方法，允许手动渲染与卸载 chart 图
  - 新增 animation 属性，如果为 true 则会强制触发渲染过渡动画。该配置受 `options.animation` 属性影响，如果该配置为 false 则不会启用过渡动画
- 移除反转色功能
- 新增图标页面
- 修改国际化图标
- 剔除无用代码，性能++++

## 4.1.7

### Feats

- 新增 mock 支持
- 重新梳理 demo views 包

### Fixes

- 修复 RCollapseGrid 组件显示问题，现在如果未存在溢出情况，不会显示 展开/收起 按钮

## 4.1.6

### Feats

- 现在支持切换内容区域的过渡动画效果
- 优化了一些布局的样式细节
- 将过渡动画与 Spin 动画结合
- 拆分了布局组件，使得它看起来更合理

### Fixes

- 修复 RChart 组件不能根据内容区域尺寸变化更新 chart 图

## 4.1.5

### Fixes

- 修复 windows 平台下构建失败问题
- 修复换行符导致构建失败问题
- 修复特定 node pnpm 版本构建栈溢出问题
- 修复 `RCollapseGrid` 组件 open 属性歧义问题

## 4.1.4

该版本后，不会做破坏性更新了。版本功能趋于稳定，后续更新不会那么频繁了。。。。。

### Feats

- 新增版权信息开关
- 做了一些小小的细节更新

### Fixes

- 修复获取部分元素高度不准确导致布局一些小问题
- 修复底部版权信息展示问题

## 4.1.3

### Feats

- 新增切换路由自动取消上一路由所有请求。但是可以通过配置 `useRequest` 与 `request` 方法的 `cancelConfig.cancel` 属性控制是否需要自动取消该请求。该配置默认为 `true`，当配置为 `false` 时，则不会被取消器取消

```ts
import { useRequest, useHookPlusRequest } from '@/axios/index'

// useRequest
const { data, loading, run } = useRequest<{
  title: string
}>(
  {
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    method: 'get',
    cancelConfig: {
      cancel: true,
    },
  },
  {
    manual: true,
  },
)

// request
request({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  method: 'get',
  cancelConfig: {
    cancel: true,
  },
})
```

- `localConfig` 新增配置类型保护
- 将原 `AppComponent` 组件包移动至 `app-components` 包中，并且按照其功能拆分为 `sys` `provider`
- 现在将异步注册 `vue-router`
- `RChart` 组件新增 `macarons` 主题。现在支持便捷的自定义主题，在[主题编辑器](https://echarts.apache.org/zh/theme-builder.html)编辑主题后，下载主题（json）放置于对应主题包中即可被自动注册
- 兼容 `yarn` `npm` 包管理器的 `manualChunks` 配置

## 4.1.2

### Fixes

- 紧急修复由于路由配置错误，导致无限重定向至首页问题

## 4.1.1

### Feats

- 取消模板默认的 Transition loading 动画，采用 NSpin 组件实现
- 新增 router meta env 属性，可以根据当前构建环境判断显示、隐藏菜单项

### Fixes

- 修复页面切换闪烁问题
- 修复刷新页面方法执行后抛出 vue 相关的错误

## 4.1.0

### Feats

- 升级 vue 版本为 v3.3.4。并且配套升级了模板的一些插件
- RTransitionComponent 组件加入 Suspense 组件的支持（试验性加入，可能会移除）
- 更新部分组件的事件触发方式，类似 onUpdateValue、onupdate:value 方法改为 props 定义而非 emit（受控、非受控）
- 更新路由切换动画的透明度，视觉效果更友好
- App.tsx 组件内部逻辑抽离为 AppStyleProvider。将一些组件存放位置放在 AppComponents 文件包中
- 新增 useRequest useHookPlusRequest 两个请求 hook，具体使用方法看示例（基于 vue-hook-plus useRequest 实现）
  - useRequest 支持直接配置请求与配置请求相关的配置（缓存、节流、防抖等）
  - useHookPlusRequest 支持接收一个 Promise 返回值的方法，可以用来包裹 axios 方法然后进行请求配置

```ts
import axiosInstance from '@/axios/instance'
import { useRequest, useHookPlusRequest } from '@/axios/index'

// 使用 useRequest
const { data, loading, run } = useRequest<{
  title: string
}>(
  {
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    method: 'get',
  },
  {
    manual: true,
  },
)

// 使用 useHookPlusRequest
export const getWeather = (city: string) => {
  return axiosInstance<AxiosTestResponse>({
    url: `https://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz&city=${city}`,
    method: 'get',
  })
}

const { data, loading, run } = useHookPlusRequest(getWeather, {
  throttleWait: 1000,
})

// 手动更新请求参数
run('some value')
```

## 4.0.3

### Feats

- 弃用 yarn 包管理器，使用 pnpm 作为模板包管理器
- 新增路由切换时的内容区域动画
- 更新了一些组件名称
- 更新了自定义指令创建方式，改为函数式

### Fixes

- 修复 axios 模块的一些类型错误
- 剔除了一些无用方法，重写了一些方法
- 修复强制跳转父级菜单地址导致错误页问题

## 4.0.2

### Feats

- 新增平级路由配置（router meta）配置项，sameLevel 允许你将子路由标记为平级模式，跳转时不会出发菜单、标签页更新，仅会更新面包屑
- 修改路由菜单显示、隐藏逻辑，现在仅会针对权限的验证匹配选择是否加入菜单列表中
- 更新 setupAppMenu 方法触发时机（Layout => menu store），现在将在 pinia menu store 初始化时触发 App Menu 更新
- 更新了 utils 包中的一些方法，进行了一些重写和重命名
- GlobalSearch 组件支持上下按键切换、回车键选择
- 整合 router 模块的一些包，让它看起来更合理一点
- 剔除 styles 包中一些不合理的样式模块
- 补充了一些注释与说明文档

### Fixes

- 修复不能正确渲染浏览器标题问题
- 修复初始化模板菜单函数与菜单更新函数重复执行一些方法的问题
- 修复指令示例变量绑定错误导致示例错误问题
- 修复路由白名单失效 bug

## 4.0.1

### Feats

- 更改自定义路由暴露形式（由变量暴露改为方法获取）
- 模板所有方法进行检查，重命名部分方法（使其更加贴切其逻辑）
- 部分逻辑进行重写，使代码更容易阅读与维护
- 模板类型进一步完善

### Fixes

- 修复了内存高占用问题（路由模块）
- 修复类型导入错误问题

## 4.0.0

### Feats

- 重构 types 包设计，现在的类型包更加清晰
- 重构 utils 包设计，该包下的所有 hook 提供了更加友好的类型提示
- RayIframe 组件新增 lazy 属性
- 新增 v-disabled 指令
- demo 页面展示优化

### Fixes

- 修复一些已知的 bug

### 补充

> 这次花了一点时间，将模板进行重新梳理，进行了一些很大的破坏性更新改动。核心重点是 types 包与 utils 包的重大更新。不过只是做了初步的一些大方向的更新，后续的细节更新还在继续。。。

## 3.3.7

### Feats

- 新增全局指令（目前仅有：v-copy、v-debounce、v-throttle）

### Fixes

- 修复错误的插件命名，导致项目构建失败（viteComponents）

## 3.3.6

### Feats

- 重写 axios interceptor 方法。现在逻辑更加清晰，并且支持请求错误、响应错误处理。补充了两个工具函数
- MenuTag 支持动态更新所在位置
- 修复了鉴权方法的 bug
- 更新了 router permission 方法（路由守卫）
- 补充了一些模块文档
- 搜索支持以菜单模块的 icon 进行渲染，如果为空则以 icon table 默认填充
- 重写锁屏功能，现在将锁屏逻辑与解锁逻辑拆分为两个组件

### Fixes

- 修复选中所搜结果后，菜单不能默认展开 bug

### 补充

> 文档拖欠太多了，我补不回来了，就。。。算了吧，我在每个关键模块补充了对应的 md 说明文档，凑合一下吧。真希望有一个好心人帮补充文档。

## 3.3.5

### Feats

- Router Meta 属性支持自定义图标，不再局限于 RIcon，支持自定义图标
- 更改部分组件默认值，默认值统一为 `null`
- 调整 validRole 方法逻辑，将该方法以前逻辑拆分为 validRole 与 validMenuItemShow 两个方法
- 新增使用手册

### 补充

> 由于文档已经拖更很久，所以补充一个使用手册。最近太忙了，一直忙着更新完善模板本身，文档的事情暂时没有时间去维护更新，所以与模板断层太久。。。后续有时间肯定会补上！！！

## 3.3.4

### Feats

- 新增 RayIframe 组件
- 同步更新 `naive-ui` 版本至最新版本(2.34.3 => 2.34.4)
- 支持更多 appConfig 配置

### TODO

- MenuTag: 切换页面时, 同步更新该标签的所在位置

## 3.3.3

### Feats

- 新增五个计算方法（解决精度问题）
- 解决一些小问题

## 3.3.1

### Feats

- 新增 useAppTheme sass 方法

```ts
useAppTheme key 类型: 'dark' | 'light'
```

```scss
// 暗色主题
.demo--dark {
  @include useAppTheme('dark') {
    color: #ffffff;
  }
}
// 明亮主题
.demo--light {
  @include useAppTheme('light') {
    color: #000000;
  }
}
```

- 一些细节优化
- axios 拦截器与 axios instance 进行独立（现在不再 instance.ts 文件中编写拦截器相关逻辑），拦截器逻辑放在 inject 包中
- 一些 bug 修复

## 3.3.0

### 特征

- 取消 RootRoute 属性暴露全局
- 新增 Route Meta keepAlive 配置开启页面缓存（可以在 AppConfig APP_KEEP_ALIVE 中进行缓存的配置管理）
- 回退使用自动导入路由模块方式，具体使用方法查看 [路由配置](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/src/router/README.md)
- 新增 Route Meta order 配置，配置菜单顺序
- 新增 useVueRouter 方法，让你在 setup 环境之外使用 router hook
- 补充引入了一些 eslint 规则
- 支持更多 appConfig 配置

### 补充

- 后续该模板还会持续维护，会尽可能多的支持更多业务场景
- 最近破坏性更新很多，发布比较频繁，后续应该不会有这么大的破坏性更新。核心重点会放在模板整体的健壮性、可维护性上
- 未来希望模板拆分为一个高拓展性的工程，积木式管理项目，让项目模块之间尽可能的解耦。让模板有更好的拓展性，让你在使用时，可以根据自身业务需求进行拓展（当然，我希望你能以项目的基本维护原则延续）

## 3.2.3

### 特征

- 新增锁屏功能（值得注意的是，锁屏解锁后会刷新当前 RouterView 区域，因为在处于锁屏状态时，会自动销毁所有的操作页面。可以理解为是一个 v-if 操作行为）
- 新增 dayjs hook，支持国际化与切换
- 支持更多 appConfig 配置
- 调整 setupAppRoute 触发时机（现在会在 layout 渲染阶段触发）
- 补充了新的组件分包 AppComponents，存放该系统的一些组件（会与系统进行一些深度绑定，例如 AppAvatar 组件依赖系统数据）

### 补充

- 锁屏功能的设计并不理想，后期会进行破坏性更新。锁屏触发条件与管理方式目前并不理想，管理有点混乱
- 后期会考虑补充 keepAlive 功能。目前没有实现是因为该功能实现的话，需要将所有路由提升为顶层路由（这是 KeepAlive 组件限制），目前并未实现该功能。后期会在权衡后增加该功能，实现时会在 RTransitionComponent 进行拓展补充

## 3.2.2

### 特征

- 移除 amfe-flexible 插件，改用为 postcss-px-to-viewport 作为适配插件
- 支持更多 appConfig 配置

## 3.2.1

### 特征

- 调整系统文件分包，现在结构更加合理、更加清晰
- 新增 src/appConfig 配置入口，配置系统（还在持续补充中...）
- vite 版本更新到 4.3.8

## 3.1.8

### Fixes

- 修复路由切换不能复位容器位置问题（让可视区域置顶）

### Feats

- 新增 useI18n hook 方法
- 手动补充 AppRouteRecordRaw、AppRouteMeta 类型
- 重新拆分 Layout 入口文件
- 重新指定组件暴露方法、属性
- 修改国际化管理方式，现在支持自动合并管理与结合 i18n-ally 使用。并且支持 unplugin-vue-i18n 构建，提高性能

## 3.1.7

### Fixes

- 修复默认获取容器可视区域高度问题
- 修复登陆页虚线高度问题

### Feats

- 修改 Menu 菜单过滤逻辑，现在如果权限不匹配或者设置了 hidden 属性，则会被过滤掉
- 移除 $activedColor 全局 sass 变量，使用 --ray-theme-primary-color 替代
- 新增路由菜单检索功能
- 移除 App.tsx 中同步主题方法，改为使用 cfg 配置并且使用 ejs 注入
- 移除 MenuTag 默认主题色，现在会以当前主题色为主色

## 3.1.6

### Fixes

- 修复移动端登陆页显示问题
- 改进了一些方法逻辑的问题
- 修改移动端自适应配置方案(现在使用 postcss-px-to-viewport)，默认不启用
- 修复 RayTable 实例方法暴露错误
- 修复 sideBarLogo.icon 为空时警告问题，现在未配置该属性则不会渲染图标
- 修复 RayTable 演示页面 action 方法失效问题

### Feats

- 新增加载动画
- 现在可以直接配置首屏加载动画一些信息(cfg.ts)
- 新增对于 ejs 支持
- 补充一些细节注释
- 新增 RChart 组件 loading、loadingOptions 属性配置
- 新增反转色模式
- 修改 Menu 菜单过滤逻辑，现在如果权限不匹配或者设置了 hidden 属性，则会被过滤掉

## 3.1.5

### Fixes

- 配置 `tsconfig.json` 中 `ignoreDeprecations` 属性，消除 `ts5.0` 破坏性配置更新警告

### Feats

- 基于 `onlyoffice` 新增 `Office` 功能(待完成...)
- 重写 `AxiosInstance` 类型
- `src/types` 分包更加清晰
- 将主色调同步至 `body`，默认同步 `cfg.primaryColor` 值
- 登陆页一些修改(现在支持简单的响应式)
- 将一些设置型功能抽离为组件
- 调整同步主题色执行时机

## 3.1.4

### Fixes

- 修复主题色切换后，点击、鼠标滑入主题未被修改问题
- 修复 menu store 菜单切换可能会重复执行问题

### Feats

- 补充 MenuTag 标签页功能，现在支持丰富的关闭操作与右键菜单激活操作菜单功能
- 新增配置全局重定向地址配置（详情见：[cfg](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/cfg.ts)）
- 补充了一些不值一提的小东西

## 3.1.3

### Fixes

- 修复菜单栏、标签页栏 border 显示问题

### Feats

- RayTable 组件新增全屏、尺寸调整功能
- 新增 css 预处理全局注入辅助函数。详情看 [mixinCSS](https://github.com/XiaoDaiGua-Ray/xiaodaigua-ray.github.io/blob/main/cfg.ts)
- RayTable 组件部分提示文案修改
- body 新增当前主题色 class 标识(dark: ray-template--dark，light: ray-template--light)，便捷主题切换配置

## 3.1.2

### Fixes

- 修复 DatePicker 组件国际化部分失效问题

### Feats

- 修改 demo 页面展示
- 修改 RCollapseGrid、RayTable 组件为默认不展示 border

## 3.1.1

### Fixes

- 修复国际化语言包模块合并处理不能正常合并问题
- 修复国际化切换时，面包屑、标签页不能正常切换

### Feats

- 新增面包屑
- 支持国际化语言包分包管理(但是，依旧是合并到一个文件中，所以需要注意 key 的管理)
- 新增国内预览地址
