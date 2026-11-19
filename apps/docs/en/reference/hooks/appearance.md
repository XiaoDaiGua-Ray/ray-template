# Themes, Language, and Watermark Hooks {#主题、语言和水印-hooks}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

## Interactive example {#交互示例}

<AdminExample path="/template-hooks" title="Themes and watermarks" focus="useTheme,useWatermark" layout />

::: details View example source
<<< @/../admin/src/views/demo/template-hooks/index.tsx
:::

## useTheme

`useTheme()` returns these methods. Setting Store and the global provider manage color overrides together.

| Method                         | Behavior                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `lightTheme()` / `darkTheme()` | Select manual light or dark mode and update Naive UI theme overrides.                                                     |
| `toggleTheme()`                | Select the manual mode opposite the current resolved mode.                                                                |
| `syncSystemTheme()`            | Read the browser preference and switch to `auto`. Setting Store then follows system changes.                              |
| `getAppTheme()`                | Returns `{ theme, themeLabel, themeI18nLabel }`. `theme: true` means dark. `themeLabel` is the literal `Dark` or `Light`. |

`getAppTheme()` returns a snapshot. Call it in a computed value or render function for UI that follows language or theme. Set a custom primary color with `changePrimaryColor` in [Setting Store](../store/setting).

## useI18n

<AdminExample path="/web-hooks" title="Switch the example language and inspect translations" focus="useI18n" />

::: details View language switching source
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

`useI18n(namespace?)` exposes `t(key, ...args)`, `locale(lang)`, and the Vue I18n global API when initialized. `useI18n('menu').t('Dashboard')` and `useI18n('menu').t('menu.Dashboard')` use the same key. Without a namespace, a bare string is returned as written. Before initialization, `t` returns the resolved key. The same function reads the current instance after initialization.

`@/hooks` also exports a standalone `t(key)` that returns the original key for route metadata and static translation tooling. Change the whole application language with `useSettingActions().updateLocale(lang)` to sync Day.js, the UI library, and persisted settings. Calling `useI18n().locale` directly updates only Vue I18n and the HTML language attribute.

```ts
import { useI18n, useTheme } from '@/hooks'
import { useSettingActions } from '@/store'
import { computed } from 'vue'

export function useAppearanceSettings() {
  const { t } = useI18n('menu')
  const theme = useTheme()
  const { updateLocale } = useSettingActions()
  const title = computed(() => t('Dashboard'))
  return {
    title,
    followSystem: theme.syncSystemTheme,
    switchToEnglish: () => updateLocale('en-US'),
  }
}
```

## useWatermark

`setWatermarkContent(content)` merges new watermark text and ignores an empty string. `showWatermark()`, `hiddenWatermark()`, and `toggleWatermark()` change shared visibility. To hide it, use `hiddenWatermark()`. Update font, rotation, and spacing in Setting Store's `watermarkConfig`. The position of `AppWatermarkProvider` determines its scope.

```ts
import { useWatermark } from '@/hooks'

export function useReportWatermark() {
  const { setWatermarkContent, showWatermark, hiddenWatermark } = useWatermark()
  return {
    enable() {
      setWatermarkContent('Internal report')
      showWatermark()
    },
    disable: hiddenWatermark,
  }
}
```

[useTheme source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useTheme.ts) · [useI18n source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useI18n.ts) · [useWatermark source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useWatermark.ts)
