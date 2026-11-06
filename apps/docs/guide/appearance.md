# 主题与国际化

## 主题与样式

在「偏好设置 → 外观 → 界面风格」切换。风格与浅色、深色、跟随系统独立；切换即时生效，刷新和偏好导入导出会保留选择。

| 风格          | 外观                                         |
| ------------- | -------------------------------------------- |
| Naive UI 默认 | 使用组件库原生 token                         |
| 现代化        | 默认风格：Ray 蓝、低饱和底色、适度圆角和留白 |
| Material      | 紫色调、较大的圆角、胶囊按钮和分层表面       |
| 朴素          | 中性灰、小圆角和无阴影表面                   |

手动选择的主题色优先于预设，并随风格保留；点击「使用风格默认色」可恢复当前风格的配色。新用户、恢复默认设置，以及缺少风格的历史配置都使用现代化。已有的显式风格选择会在刷新和导入时保留。

### 样式放在哪里

- Naive UI 组件的颜色、圆角、密度和阴影走 [`theme-overrides`](https://github.com/tusen-ai/naive-ui/blob/main/demo/pages/docs/customize-theme/enUS/index.md)。四套预设定义在 `packages/ui/src/theme-presets.ts`，后台现代化风格的应用级配置入口是 `APP_THEME.appNaiveUIThemeOverrides`。每次用当前风格、明暗模式和用户主色计算配置，页面与离散消息、通知和弹窗共享同一份配置。
- 自有导航、标签页和工作区使用 `packages/ui/src/theme.css` 的 `--r-*` 语义变量。后台把 `useThemeVars()` 解析出的值映射到根节点，文档示例把相同映射限制在示例容器。自有元素使用这套变量，以便和组件库一起换肤。
- 自有卡片和控件分别使用 `--r-radius`、`--r-control-radius`；页面说明文字保留正文级可读性，不直接继承对比度偏低的弱文本色。页面阴影只采用预设显式配置的柔和阴影，Naive UI 浮层继续使用原生样式。
- 全局 Sass 保留 reset、工具和历史表单宽度约定。组件 SCSS 负责布局、滚动和交互；仅在组件库没有合适 API 时，用自有类限定内部结构选择器的范围。不要在全局选择器中给 `.n-*` 写配色或直接依赖 `--n-*` 来切换主题。
- 首屏启动样式内联于 `apps/admin/index.html`，在应用挂载前显示品牌和细线加载状态，并读取已保存的界面风格与明暗模式。加载完成即进入应用；启动失败保留中英文提示与重试按钮。系统启用减少动态效果时，入场动画关闭，进度线减速。图表配色仍由 ECharts 主题和页面 options 管理。

全局 Sass 辅助文件通过 `vite.custom.config.ts` 注入；CSS Modules 的名称以 camelCase 暴露。

## 自定义 CSS：沿用动态配置 {#custom-css}

后台页面已经由 `AppNaiveGlobalProvider` 提供组件主题，`AppStyleProvider` 将解析后的颜色和尺寸映射到 `<html>`。新增页面直接使用语义变量即可跟随四种风格、明暗模式和自定义主色；不需要再写一组监听器或在每次渲染时读取计算样式。

变量的唯一实现来源是 [`theme.css`](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/theme.css) 和 [`createRayThemeStyle`](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/theme-presets.ts)。下表说明用途，不复制整套色值。

| 用途                               | 变量                                                                  |
| ---------------------------------- | --------------------------------------------------------------------- |
| 页面底色、卡片、次级表面、悬停表面 | `--r-canvas`、`--r-surface`、`--r-surface-muted`、`--r-surface-hover` |
| 正文、说明、弱化文字               | `--r-text`、`--r-text-secondary`、`--r-text-muted`                    |
| 结构分隔线、可识别的控件边框       | `--r-line`、`--r-control-border`                                      |
| 主色、主色悬停值                   | `--r-theme-primary-color`、`--r-theme-primary-fade-color`             |
| 可读的强调文字、选中文字           | `--r-primary-text`、`--r-selected-text`                               |
| 卡片圆角、普通控件圆角、柔和阴影   | `--r-radius`、`--r-control-radius`、`--r-shadow-soft`                 |
| 缓动曲线、等宽字体                 | `--r-bezier`、`--r-font-mono`                                         |

`fade-color` 是历史命名，实际映射主色悬停值，不保证透明。暗色下的强调/选中文字会使用更稳妥的文字色，不保证与用户选择的主色相同。`--r-radius` 优先取 Card 圆角，`--r-control-radius` 取 common 圆角；Material 胶囊按钮等组件专属形状仍交给 Naive UI。未显式配置页面阴影时为 `none`，不会把组件库浮层阴影强加给普通卡片。

### 自有结构的写法

普通卡片优先使用 `NCard`。确实需要自有结构时，可按下面的 SFC 组织 CSS；标题、说明和按钮文案由调用方传入，便于沿用页面国际化。

```vue
<template>
  <section class="report-panel">
    <header class="report-panel__heading">
      <h2>{{ title }}</h2>
      <NButton type="primary" @click="emit('refresh')">{{
        actionLabel
      }}</NButton>
    </header>
    <p v-if="description" class="report-panel__description">
      {{ description }}
    </p>
    <div class="report-panel__content"><slot /></div>
  </section>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'

defineProps<{ title: string; description?: string; actionLabel: string }>()
const emit = defineEmits<{ refresh: [] }>()
</script>

<style scoped>
.report-panel {
  container-type: inline-size;
  min-inline-size: 0;
  padding: 1.25rem;
  border: 1px solid var(--r-line, ButtonBorder);
  border-radius: var(--r-radius, 4px);
  color: var(--r-text, CanvasText);
  background: var(--r-surface, Canvas);
}
.report-panel__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.report-panel__heading h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
.report-panel__description {
  margin-block: 0.75rem 0;
  color: var(--r-text-secondary, CanvasText);
  line-height: 1.7;
}
.report-panel__content {
  min-inline-size: 0;
  margin-block-start: 1rem;
}
@container (max-width: 32rem) {
  .report-panel__heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
```

TSX 使用相同的 class 和 CSS，样式放在组件旁并从入口 `import './index.scss'`。不要把四种风格各复制一遍选择器；语义变量会沿 DOM 继承。需要自己的间距配置时，在组件边界定义局部变量或 props，避免虚构未提供的全局间距 token。

### 在独立项目中使用共享组件

独立宿主需要同时提供三个部分：Naive `NConfigProvider`、CSS 变量作用域，以及按需提供的 `provideUiServices` 行为服务。只调用 `provideUiServices` 不会安装主题或写入 CSS。下面的例子只使用包的公开导出，已纳入文档示例类型检查；保存为自己的 `ThemeScope.vue` 后，将业务内容放进插槽。

::: details 独立宿主完整示例
<<< @/examples/ThemeScopeExample.vue
:::

传入 `theme-style="material"`、`:dark="true"` 即可选择风格和模式。`commonOverrides` 供宿主合并自定义主色；完整交互配色应一起设置 `primaryColor`、`primaryColorHover`、`primaryColorPressed` 和 `primaryColorSuppl`。后台页面则继续使用现有 `useSettingActions().changePrimaryColor()`，不必重复建立宿主。来自存储或 JSON 的风格值先通过 `normalizeThemeStyle()` 处理。

示例将导出的 Naive light/dark common 与同一份覆盖配置合并后映射，避免在当前组件中读取尚未成为祖先的 `NConfigProvider`。如果使用 `useThemeVars()`，应把读取逻辑放进 provider 的后代组件。需要翻译、图标地址或其他宿主能力时，补充自己的 `UiServices`；不要在已有后台页面里再提供一份不完整服务，从而遮蔽应用服务。

局部主题容器需要同时具有 `.r-theme-scope`、明暗 class 和映射样式。只在子元素改写 `--r-token-*`，却继承祖先已经求值的别名，可能仍读到祖先配色；这属于 [CSS 自定义属性的继承规则](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)。Vue `Teleport` 保留组件注入关系，但不会保留原来的 DOM 样式继承；自有弹出内容应传送到作用域内部，或为目标容器建立同一主题。

仅加载 `theme.css` 而没有映射 provider 时，变量会退回 `Canvas`、`CanvasText`、`Highlight`、`ButtonBorder` 等系统颜色、4px 圆角和无阴影。这不是自动选择某套风格；Naive 组件也会使用自己的默认主题。若连共享样式都没有加载，则需要导入样式或像上例一样提供明确的 `var()` 回退。局部变量映射不会改写整页，但共享样式本身还包含根节点 `color-scheme` 和通用焦点规则。

### 尺寸、滚动与动效

- 内容区的实时配置由 `AdminShell` 提供：`--layout-content-padding` 是配置值，`--layout-content-gutter` 是含窄屏调整的实际留白，`--layout-content-max-width` 由布局负责应用，`--layout-content-height` 是扣除实测头部、标签栏和页脚后的高度预算。`setting.scss` 的 Sass 变量是编译期值，不会响应偏好设置。
- 普通页面使用自然高度。确需内部滚动的工作区可使用 `calc(var(--layout-content-height, 100dvh) - 2 * var(--layout-content-gutter, 16px))`，再通过 Flex/Grid、`min-block-size: 0` 和明确的滚动容器分配空间。独立组件优先由父容器给出高度。
- 使用 `minmax(0, 1fr)`、`min-inline-size: 0` 和逻辑方向属性。组件布局优先根据可用内容宽度调整；容器查询应有祖先 `container-type: inline-size`，断点写成明确尺寸，不能在查询条件中使用 `var()`。
- 配色、圆角、阴影优先取语义变量；局部间距、图标光学尺寸、断点以及有明确用途的品牌/数据配色可以使用固定值。通用 SVG 使用 `currentColor`，Canvas 图表仍通过图表主题或 options 配色。
- 动效优先改变 `opacity` / `transform`，在对应组件中处理 `prefers-reduced-motion`。保留键盘焦点和强制颜色模式下的边框/轮廓，不用全局极短动画时长替代适配。

修改 Naive 控件优先用 props、插槽或 `themeOverrides`；必要的内部选择器必须限定在自己的组件 class 下。检查实际受影响的风格、明暗模式和窄屏，不必为纯文档修改重跑整站视觉矩阵。

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
