# 主题与国际化

## 主题与样式

默认主题色由 `apps/admin/src/app-config/design-config.ts` 管理；主题和语言由应用 Provider 同步到 Naive UI。新增组件时优先使用现有设计变量、组件库配置和局部样式。必须覆盖 Naive UI 内部样式时，以自己的组件类限定作用范围。

全局 Sass 辅助文件通过 `vite.custom.config.ts` 注入；CSS Modules 的名称以 camelCase 暴露。图表 options 由页面维护，`RChart` / `useChart` 负责实例生命周期、尺寸与主题同步；使用新增的 ECharts 图表类型时，按现有注册入口加载依赖。

## 中英文同时维护

把页面文案放进 `apps/admin/src/locales/lang/zh-CN` 和 `apps/admin/src/locales/lang/en-US` 的对应 JSON；同一语言内的命名空间要唯一。新增语言时同时补 `apps/admin/src/locales/lang/<locale>.ts` 与应用的语言配置。

```ts
import { useI18n } from '@/hooks'
import { useSettingActions } from '@/store'
import { computed } from 'vue'

const { t } = useI18n('menu')
const orderLabel = computed(() => t('Orders'))

const { updateLocale } = useSettingActions()
updateLocale('en-US')
```

在需要随语言更新的 UI 中，于渲染函数或 computed 内调用 `t`。通过 `updateLocale` 切换应用语言，以同步日期和组件库。

[语言包约定](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/locales/README.md) · [主题配置](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/app-config/design-config.ts)
