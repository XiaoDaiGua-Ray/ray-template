# 主题与国际化

## 主题与样式

在「偏好设置 → 外观 → 界面风格」切换。风格与浅色、深色、跟随系统独立；切换即时生效，刷新和偏好导入导出会保留选择。

| 风格          | 外观                                   |
| ------------- | -------------------------------------- |
| Naive UI 默认 | 使用组件库原生 token，初次使用选中此项 |
| 现代化        | Ray 蓝、低饱和底色、适度圆角和留白     |
| Material      | 紫色调、较大的圆角、胶囊按钮和分层表面 |
| 朴素          | 中性灰、小圆角和无阴影表面             |

手动选择的主题色优先于预设，并随风格保留；点击「使用风格默认色」可恢复当前风格的配色。历史设置会补齐默认风格并保留曾手动选择的主色。

### 样式放在哪里

- Naive UI 组件的颜色、圆角、密度和阴影走 [`theme-overrides`](https://www.naiveui.com/zh-CN/docs/customize-theme)。四套预设定义在 `packages/ui/src/theme-presets.ts`。每次用当前风格、明暗模式和用户主色计算配置，页面与离散消息、通知和弹窗共享同一份配置。
- 自有导航、标签页和工作区使用 `packages/ui/src/theme.css` 的 `--r-*` 语义变量。后台把 `useThemeVars()` 解析出的值映射到根节点，文档示例把相同映射限制在示例容器。自有元素使用这套变量，以便和组件库一起换肤。
- 全局 Sass 保留 reset、工具和历史表单宽度约定。组件 SCSS 负责布局、滚动和交互；仅在组件库没有合适 API 时，用自有类限定内部结构选择器的范围。不要在全局选择器中给 `.n-*` 写配色或直接依赖 `--n-*` 来切换主题。
- 首屏启动样式内联于 `apps/admin/index.html`，用于应用挂载前显示品牌、启动状态和明暗模式。图表配色仍由 ECharts 主题和页面 options 管理。

全局 Sass 辅助文件通过 `vite.custom.config.ts` 注入；CSS Modules 的名称以 camelCase 暴露。

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
