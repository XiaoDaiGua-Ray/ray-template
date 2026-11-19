# Themes and localization {#主题与国际化}

## Themes and styles {#主题与样式}

Switch styles under **Preferences → Appearance → Interface style**. Style is independent of light, dark, and system mode. Changes apply immediately, survive refresh, and are included in preference import and export.

| Style            | Appearance                                                                        |
| ---------------- | --------------------------------------------------------------------------------- |
| Naive UI default | Uses the component library's native tokens.                                       |
| Modern           | The default style. Ray blue, subdued backgrounds, moderate radii, and whitespace. |
| Material         | Purple tones, larger radii, pill-shaped buttons, and layered surfaces.            |
| Plain            | Neutral gray, small radii, and flat surfaces.                                     |

A manually selected primary color takes precedence over a preset and is retained when switching styles. Use **Use preset color** to restore the active preset's color. Solid buttons with a custom primary color choose black or white text for the actual fill of each interaction state. A translucent fill is composited over the current card background. New users, restored defaults, and legacy settings without a style use Modern. An explicitly chosen style survives refresh and import.

### Where styles live {#样式放在哪里}

- Use [Naive UI theme overrides](https://github.com/tusen-ai/naive-ui/blob/main/demo/pages/docs/customize-theme/enUS/index.md) for component colors, radii, density, and shadows. The four presets are defined in `packages/ui/src/theme-presets.ts`. `APP_THEME.appNaiveUIThemeOverrides` is the app-level entry point for the Modern style. Overrides combine the active preset, light or dark mode, and the user's primary color. Pages and discrete messages, notifications, and dialogs share the resulting configuration.
- Custom navigation, tabs, and workspace surfaces use the `--r-*` semantic variables from `packages/ui/src/theme.css`. Admin maps the resolved `useThemeVars()` values to the root element. Docs examples scope the same mapping to their containers. Use these variables so custom elements follow the component theme.
- Custom cards and controls use `--r-radius` and `--r-control-radius`, respectively. Use readable body-level contrast for page descriptions. Page shadows use explicit soft shadows from the preset, while Naive UI overlays retain their native styles.
- Global Sass contains resets, utilities, and legacy form-width conventions. Component SCSS handles layout, scrolling, and interaction. When a suitable component API is unavailable, scope any internal selectors under your own class. Keep theme colors out of global `.n-*` rules and use semantic variables for theme switching.
- Startup styles are inline in `apps/admin/index.html`. They show the brand and a thin progress indicator before the app mounts and read the saved style and color mode. The app appears when startup completes. A failure shows a localized message and retry button. Reduced motion disables the entrance animation and slows the progress line. ECharts themes and page options control chart colors.

`vite.custom.config.ts` injects global Sass helpers. CSS Modules expose class names in camelCase.

## Custom CSS that follows live settings {#custom-css}

`AppNaiveGlobalProvider` supplies component themes within Admin. `AppStyleProvider` maps resolved colors and dimensions to `<html>`. Pages can use semantic variables directly to follow all four styles, light and dark mode, and custom primary colors.

The variables are implemented in [theme.css](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/theme.css) and [createRayThemeStyle](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/theme-presets.ts).

| Use                                                          | Variables                                                             |
| ------------------------------------------------------------ | --------------------------------------------------------------------- |
| Page background, cards, subdued surfaces, and hover surfaces | `--r-canvas`, `--r-surface`, `--r-surface-muted`, `--r-surface-hover` |
| Body, supporting, and subdued text                           | `--r-text`, `--r-text-secondary`, `--r-text-muted`                    |
| Structural dividers and visible control borders              | `--r-line`, `--r-control-border`                                      |
| Primary color and its hover value                            | `--r-theme-primary-color`, `--r-theme-primary-fade-color`             |
| Readable accent and selected text                            | `--r-primary-text`, `--r-selected-text`                               |
| Card radius, control radius, and soft shadow                 | `--r-radius`, `--r-control-radius`, `--r-shadow-soft`                 |
| Easing and monospace font                                    | `--r-bezier`, `--r-font-mono`                                         |

Despite its historical name, `fade-color` maps to the primary hover color, which may be opaque. In dark mode, accent and selected text use a color chosen for contrast and may differ from the user's primary color. `--r-radius` uses the Card radius when available, while `--r-control-radius` takes the common radius. Naive UI controls component-specific shapes such as Material pill buttons. Without an explicit page shadow, the value is `none`. Overlay shadows remain on overlays.

### Style custom markup {#自有结构的写法}

Use `NCard` for ordinary cards. For custom markup, follow the SFC below and pass the title, description, and button label from the caller to use its translations.

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

TSX uses the same classes and CSS. Keep styles beside the component and load them with `import './index.scss'`. Semantic variables inherit through the DOM and cover the four styles. Define local variables or props for component-specific spacing.

### Use shared components in a standalone project {#在独立项目中使用共享组件}

A standalone host supplies a Naive `NConfigProvider`, a CSS variable scope, and optional behavior services through `provideUiServices`. The provider owns component themes, and the scope owns CSS values. The example uses public exports and is included in docs example type checks. Save it as `ThemeScope.vue` and pass business content in its slot.

::: details Complete standalone host example
<<< @/examples/ThemeScopeExample.vue
:::

Use `theme-style="material"` and `:dark="true"` to choose the style and mode. Merge a custom primary color through `commonOverrides`. For complete interaction colors, set `primaryColor`, `primaryColorHover`, `primaryColorPressed`, and `primaryColorSuppl` together. Inside Admin, use `useSettingActions().changePrimaryColor()` with the existing host. Pass values from storage or JSON through `normalizeThemeStyle()` first.

The example merges the exported Naive light or dark common theme with the same overrides before mapping variables. To read `useThemeVars()`, place the read in a descendant of `NConfigProvider`. Provide your own `UiServices` as needed for translation, icon URLs, or other host behavior. Existing Admin pages should use the application services they already inherit.

A local theme scope needs `.r-theme-scope`, a light or dark class, and the mapped styles. Overriding only `--r-token-*` on a child can leave aliases with values already resolved on an ancestor. See [CSS custom property inheritance](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties). Vue `Teleport` retains Vue injection but uses the target's DOM style inheritance. Teleport custom overlays inside the scope or apply the same theme to the target container.

With `theme.css` alone, variables fall back to system colors such as `Canvas`, `CanvasText`, `Highlight`, and `ButtonBorder`, plus 4 px radii and no shadow. Naive components use their default theme. Import the shared stylesheet or provide explicit `var()` fallbacks. Local mappings are scoped to the container. The shared stylesheet also defines root `color-scheme` and common focus styles.

### Sizing, scrolling, and motion {#尺寸、滚动与动效}

- `AdminShell` provides live content sizing. `--layout-content-padding` is the configured padding, `--layout-content-gutter` is the effective spacing after narrow-screen adjustments, `--layout-content-max-width` is applied by the layout, and `--layout-content-height` is the available height after measuring the header, tabs, and footer. Sass values in `setting.scss` are resolved at build time.
- Let ordinary pages size naturally. Workspaces that require internal scrolling can use `calc(var(--layout-content-height, 100dvh) - 2 * var(--layout-content-gutter, 16px))` and allocate the space with flex or grid, `min-block-size: 0`, and a defined scroll container. For standalone components, prefer a height provided by the parent.
- Use `minmax(0, 1fr)`, `min-inline-size: 0`, and logical properties. Adapt to available content width. Container queries require an ancestor with `container-type: inline-size` and explicit breakpoint lengths. Query conditions cannot use `var()`.
- Use semantic variables for colors, radii, and shadows. Fixed values can express local spacing, optical icon sizes, breakpoints, and intentional brand or data colors. Shared SVGs use `currentColor`, while Canvas chart colors come from themes or chart options.
- Prefer `opacity` and `transform` for motion and handle `prefers-reduced-motion` in the relevant component. Retain keyboard focus outlines and borders or outlines in forced-colors mode.

Prefer props, slots, or `themeOverrides` when customizing Naive components. Scope any necessary internal selectors inside your component class. Check the affected preset, color mode, and narrow layout. Prose-only edits can use source and formatting checks.

For large-screen designs that require proportional scaling, add a matching path rule to `viewportIncludeFiles` in root `postcss.config.cjs`, for example `[/[/\\]large-screen[/\\]/]`. An empty list disables `postcss-px-conversion`. For matching Admin styles, the plugin converts to `vw` using a 1920 px design width. It excludes third-party dependencies, `.ignore` selectors, and rules inside media or container queries.

## Maintain Chinese and English together {#中英文同时维护}

Place page copy in the matching JSON files under `apps/admin/src/locales/lang/zh-CN` and `apps/admin/src/locales/lang/en-US`. Namespaces must be unique within each language. To add a language, also update `apps/admin/src/locales/lang/<locale>.ts` and the application's locale configuration.

```ts
import { useI18n } from '@/hooks'
import { useSettingActions } from '@/store'
import { computed } from 'vue'

const { t } = useI18n('menu')
const orderLabel = computed(() => t('Orders'))

const { updateLocale } = useSettingActions()
updateLocale('en-US')
```

Call `t` in the render function or a computed value when the UI should react to language changes. Switch the application language through `updateLocale` to keep the date and component-library locales in sync.

[Language pack conventions](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/locales/README.md) · [Theme configuration](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/app-config/design-config.ts)
