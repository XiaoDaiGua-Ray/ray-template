# Setting Store

`useSettingGetters()` 返回计算引用，`useSettingActions()` 修改偏好及相关副作用。设置会在刷新后恢复。运行中切换时优先用已提供的动作，避免 UI、日期语言或 HTML 样式不同步。

## Getters

| Getter                                         | 字段与默认行为                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `getLayoutConfig`                              | `layoutConfig`，布局模式和工作区尺寸，见下表。                                             |
| `getDrawerPlacement`                           | `drawerPlacement`，设置抽屉方向，默认 `right`。                                            |
| `getPrimaryColorOverride`                      | `primaryColorOverride`，Naive UI 主题覆盖；默认主色 `#3b63d9`。                            |
| `getAppTheme` / `getAppThemeStr`               | `_appTheme` 为实际深色布尔值，`appTheme` 为 `light/dark/auto` 模式，初始 `light`。         |
| `getLocaleLanguage`                            | `localeLanguage`，应用语言，默认读取历史值或系统默认配置。                                 |
| `getMenuTagSwitch` / `getBreadcrumbSwitch`     | `menuTagSwitch` / `breadcrumbSwitch`，默认显示标签和面包屑。                               |
| `getLockScreenSwitch`                          | `lockScreenSwitch`，锁屏设置弹窗显隐，默认关，不持久化。                                   |
| `getCopyrightSwitch`                           | `copyrightSwitch`，默认显示版权区。                                                        |
| `getContentTransition`                         | `contentTransition`，路由切换动画，默认 `scale`。                                          |
| `getWatermarkSwitch` / `getWatermarkConfig`    | `watermarkSwitch` 默认关；配置包含文字、字体大小、行高、宽高、偏移、间隔、旋转和 `cross`。 |
| `getAppRootRoute`                              | `appRootRoute`，默认 `{ name: 'Dashboard', path: '/dashboard' }`。                         |
| `getSideBarLogo`                               | `sideBarLogo`，`icon`、`title`、`url`、`jumpType`。默认 `logo/ray`，站内跳转到仪表盘。     |
| `getKeepAliveConfig`                           | `keepAliveConfig`，默认开启、最多 10 个、排除列表为空。                                    |
| `getMenuConfig`                                | `menuConfig`，侧栏、折叠、图标、手风琴与滚动配置。                                         |
| `getColorWeakness` / `getDynamicDocumentTitle` | `colorWeakness` 默认关，`dynamicDocumentTitle` 默认开。                                    |

`layoutConfig` 的 `mode` 为 `side`（默认）、`top`、`mixed`。`contentWidth` 默认 `fluid`，也可取 `fixed`。`contentMaxWidth` 默认 1200，限制在 640–2560；`contentPadding` 默认 16，限制在 0–48；`fixedHeader`、`fixedFooter` 默认开启。旧缓存水合时补齐字段并规范化范围。

`menuConfig` 默认菜单宽 272、折叠宽 64、普通和折叠图标均为 16、缩进 24。`collapsedMode` 默认 `width`，`transform` 模式改变位置；`accordion`、`inverted`、`nativeScrollbar` 默认关，`menuSiderBarLogo` 默认开。`sideBarLogo.jumpType` 用 `station` 站内跳转或 `outsideStation` 打开外部地址，未传 `url` 时不跳转。缓存中的旧裸图标名会尝试映射成完整名称；需要持久化的 Logo 建议用图标名字符串，VNode 不适合作为缓存值。

## Actions

| 方法                                        | 行为                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| `updateSettingState(key, value, callback?)` | 更新已有字段。普通对象浅合并；`layoutConfig` 额外做格式与范围校验。成功后调用可选回调。 |
| `updateLocale(key)`                         | 更新 Vue I18n、Day.js、语言缓存和 Store，Naive UI 从 Store 同步语言。                   |
| `changePrimaryColor(value, alpha = 0.85)`   | 更新 Naive UI 主色、hover/pressed/supplement 和 HTML CSS 变量。                         |
| `toggleColorWeakness(bool)`                 | 更新设置并切换 HTML 反色滤镜。                                                          |

切换主题使用 [useTheme](../hooks/appearance#usetheme)，切换首页使用 [useAppRoot](../hooks/navigation#useapproot)。修改嵌套配置时传入完整的下一级对象，浅合并不会递归保存更深层字段。

```ts
import { useSettingActions, useSettingGetters } from '@/store'

export function useCompactWorkspace() {
  const { getLayoutConfig } = useSettingGetters()
  const { updateSettingState } = useSettingActions()
  const apply = () =>
    updateSettingState('layoutConfig', {
      mode: 'mixed',
      contentWidth: 'fixed',
      contentMaxWidth: 1200,
    })
  return { config: getLayoutConfig, apply }
}
```

[Getters 与 Actions](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/hooks/useSettingStore.ts) · [状态类型](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/setting/types.ts) · [默认配置](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/setting/constant.ts) · [持久化实现](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/setting/index.ts)
