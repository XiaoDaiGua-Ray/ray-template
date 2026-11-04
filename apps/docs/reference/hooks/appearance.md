# 主题、语言和水印 Hooks

<script setup>
import AdminExample from '../../examples/AdminExample.vue'
</script>

## 交互示例

<AdminExample path="/template-hooks" title="主题和水印" focus="useTheme,useWatermark" layout />

::: details 查看示例源码
<<< @/../admin/src/views/demo/template-hooks/index.tsx
:::

## useTheme

`useTheme()` 返回下列方法。颜色覆盖由设置 Store 和全局 Provider 一起管理。

| 方法                           | 行为                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `lightTheme()` / `darkTheme()` | 切换为手动浅色或深色，更新 Naive UI 的主题覆盖。                                                                   |
| `toggleTheme()`                | 根据当前实际明暗状态切换到相反的手动主题。                                                                         |
| `syncSystemTheme()`            | 读取浏览器偏好并切换到 `auto`，之后由设置 Store 跟随系统变化。                                                     |
| `getAppTheme()`                | 返回 `{ theme, themeLabel, themeI18nLabel }`；`theme` 为 `true` 表示深色，`themeLabel` 是固定的 `Dark` / `Light`。 |

`getAppTheme()` 返回一次读取的对象。界面要跟随语言或主题变化时，在 computed 或渲染中调用。自定义主色请使用 [Setting Store](../store/setting) 的 `changePrimaryColor`。

## useI18n

<AdminExample path="/web-hooks" title="切换示例语言并查看翻译" focus="useI18n" />

::: details 查看语言切换示例源码
<<< @/../admin/src/views/demo/hooks/web-hooks.tsx
:::

`useI18n(namespace?)` 返回 `t(key, ...args)`、`locale(lang)` 和初始化时可用的 Vue I18n 全局能力。`useI18n('menu').t('Dashboard')` 与 `useI18n('menu').t('menu.Dashboard')` 指向同一翻译键。未指定命名空间时，裸字符串原样返回。初始化前，`t` 返回解析后的键；初始化后同一个翻译函数会读取最新实例。

`@/hooks` 还导出独立的 `t(key)`，它只返回原始键，可供路由元数据和翻译工具静态识别。切换整个应用语言用 `useSettingActions().updateLocale(lang)`，以同步 Day.js、组件库和持久化语言；直接调用 `useI18n().locale` 只操作 Vue I18n 和 HTML 语言属性。

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

`setWatermarkContent(content)` 合并水印文字；空字符串直接忽略。`showWatermark()`、`hiddenWatermark()`、`toggleWatermark()` 修改共享显隐状态。要清除显示，请调用 `hiddenWatermark()`。字体、旋转和间距从 Setting Store 的 `watermarkConfig` 修改，显示范围由 `AppWatermarkProvider` 所在位置决定。

```ts
import { useWatermark } from '@/hooks'

export function useReportWatermark() {
  const { setWatermarkContent, showWatermark, hiddenWatermark } = useWatermark()
  return {
    enable() {
      setWatermarkContent('内部报表')
      showWatermark()
    },
    disable: hiddenWatermark,
  }
}
```

源码：[useTheme](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useTheme.ts) · [useI18n](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useI18n.ts) · [useWatermark](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/hooks/template/useWatermark.ts)
