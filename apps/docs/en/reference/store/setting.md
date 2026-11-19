# Setting Store

`useSettingGetters()` returns computed refs. `useSettingActions()` changes preferences and triggers related side effects. Settings are restored after refresh. Use the provided actions so the UI, date locale, and HTML styles stay in sync.

## Getters

| Getter                                                 | Field and default behavior                                                                                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `getLayoutConfig`                                      | `layoutConfig` for layout mode and workspace dimensions.                                                                                      |
| `getDrawerPlacement`                                   | `drawerPlacement` defaults to `right`.                                                                                                        |
| `getPrimaryColorOverride`                              | Effective Naive UI token overrides from the active style, color mode, and custom primary color.                                               |
| `getThemeStyle` / `getCustomPrimaryColor`              | Style and custom primary color. `modern` is the default style. The preset color is used without a manual override.                            |
| `getAppTheme` / `getAppThemeStr`                       | `_appTheme` is the resolved dark Boolean. `appTheme` is `light/dark/auto` and starts as `light`.                                              |
| `getLocaleLanguage`                                    | `localeLanguage` uses the saved locale or system default configuration.                                                                       |
| `getMenuTagSwitch` / `getBreadcrumbSwitch`             | `menuTagSwitch` and `breadcrumbSwitch` show tabs and breadcrumbs by default.                                                                  |
| `getMenuTagTop` / `getMenuTagFixed` / `getMenuTagDrag` | `menuTagTop`, `menuTagFixed`, and `menuTagDrag` enable moving tabs to the front, protecting tabs, and drag reordering by default.             |
| `getBreadcrumbIcon` / `getBreadcrumbIconFallback`      | `breadcrumbIcon` and `breadcrumbIconFallback` show menu icons and placeholders by default.                                                    |
| `getLockScreenSwitch`                                  | `lockScreenSwitch` controls the lock setup dialog. It defaults to off and lives in memory.                                                    |
| `getCopyrightSwitch`                                   | `copyrightSwitch` shows the copyright region by default.                                                                                      |
| `getContentTransition`                                 | `contentTransition` defaults to `scale`.                                                                                                      |
| `getWatermarkSwitch` / `getWatermarkConfig`            | `watermarkSwitch` defaults to off. The configuration covers text, font size, line height, dimensions, offset, spacing, rotation, and `cross`. |
| `getAppRootRoute`                                      | Legacy `appRootRoute` defaults to `{ name: 'Dashboard', path: '/dashboard' }`.                                                                |
| `getSideBarLogo`                                       | `sideBarLogo` contains `icon`, `title`, `url`, and `jumpType`. Defaults to `logo/ray` and an internal link to the dashboard.                  |
| `getKeepAliveConfig`                                   | `keepAliveConfig` is on by default, with room for ten instances and no excluded names.                                                        |
| `getMenuConfig`                                        | `menuConfig` covers the sidebar, collapse behavior, icons, accordion behavior, and scrolling.                                                 |
| `getColorWeakness` / `getDynamicDocumentTitle`         | `colorWeakness` defaults to off and `dynamicDocumentTitle` to on.                                                                             |

`layoutConfig.mode` accepts `side` (default), `top`, `mixed`, `right`, or `split`. `contentWidth` accepts `fluid` (default) or `fixed`. `contentMaxWidth` defaults to 1200 and is clamped to 640–2560. `contentPadding` defaults to 24 and is clamped to 0–48. `fixedHeader` and `fixedFooter` default to on. Hydrating older settings fills missing fields and normalizes ranges.

`menuConfig` defaults to width 272, collapsed width 64, expanded and top navigation icons of 20 px, collapsed icons of 22 px, and indentation 24. `collapsedMode` defaults to `width`. `transform` moves the sidebar. `accordion`, `inverted`, and `nativeScrollbar` default to off, while `menuSiderBarLogo` defaults to on. `sideBarLogo.jumpType` uses `station` for internal routing and `outsideStation` for external links. Omit `url` to leave the logo without a destination. Old browser data with both icon sizes set to 16 px is migrated to the current icon defaults. Dimensions saved by the current version or present in preference files are retained. Legacy bare icon names are resolved when possible. Use a string icon name for a persisted logo because VNodes are unsuitable for storage.

## Actions

| Method                                      | Behavior                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateSettingState(key, value, callback?)` | Updates an existing field. Plain objects are shallow-merged. `layoutConfig` also checks format and ranges. Success invokes the optional callback. |
| `updateLocale(key)`                         | Updates Vue I18n, Day.js, the stored language, and Pinia. Naive UI receives its locale from Pinia.                                                |
| `changePrimaryColor(value?, alpha = 0.85)`  | Overrides the active preset's primary color. Omit the value to restore the preset.                                                                |
| `toggleColorWeakness(bool)`                 | Updates the preference and switches the HTML inversion filter.                                                                                    |

Switch themes with [useTheme](../hooks/appearance#usetheme). [useAppRoot](../hooks/navigation#useapproot) is a compatibility API for legacy preferences. When changing nested settings, pass the complete object at the next level, since merging is shallow.

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

[Getters and actions](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/hooks/useSettingStore.ts) · [State types](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/setting/types.ts) · [Defaults](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/setting/constant.ts) · [Persistence](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/store/modules/setting/index.ts)
