# Visual design and page layout

The template uses restrained blues and neutral colors. Refinement comes from consistent hierarchy, spacing, and density rather than adding shadows or decoration to every region.

## Themes and dimensions

- Consume semantic variables from [shared theme.css](../packages/ui/src/theme.css) for page backgrounds, cards, dividers, and text. [theme-presets.ts](../packages/ui/src/theme-presets.ts) owns preset values and their mapping; the admin's modern preset can be customized through `APP_THEME.appNaiveUIThemeOverrides` in [design-config.ts](../apps/admin/src/app-config/design-config.ts). Do not copy a palette into each page.
- `apps/admin/src/styles/entry.ts` imports `base.scss`; `design-system.scss` only bridges to the shared theme stylesheet. `setting.scss` contains legacy compile-time Sass dimensions, not live layout preferences. Keep `naive.scss` limited to shared control defaults. Put layout/component-specific rules in the owning directory to avoid affecting nested Naive UI instances.
- The modern preset uses 8px control radii and 12px card radii. Plain stays square and neutral, Naive retains the library's native controls, and Material uses larger shapes and tonal surfaces. Custom page surfaces use `--r-radius` / `--r-control-radius` so a preset applies beyond library components. Page sections generally use 20–28px spacing.
- Use accent colors for selection and primary actions; distinguish body text, descriptions, and eyebrow labels by color hierarchy. Page descriptions must remain readable: when a preset does not define a body-safe muted color, use the library's secondary text color rather than its weaker tertiary color.
- Use subtle dividers between top bars, tab bars, and sidebars rather than layered shadows. A small number of content cards may use two-layer shadows.
- Page surfaces use only the active preset's explicit soft shadow; library overlay shadows are not inherited by ordinary page cards. Naive's floating menus and dialogs retain their native elevation.
- Page tabs normally show only their names. Reveal the close button on hover or focus; touch users can close the active tab directly.
- The preference drawer uses one or two field columns according to available width. Keep section navigation and reset actions in consistent positions.
- When content is maximized, provide an exit control above the content, accessible by button or Esc.
- Reuse `AppPageHeader` for page headings: an eyebrow, one main title, a short description, and optional actions. Do not replace page hierarchy with long descriptions or equally prominent card headings.

## Custom CSS contract

The table below describes consumption, not a second token definition. The linked stylesheet and mapping function remain authoritative for names, values, and fallback behavior.

| Semantic property                                         | Use                                                                                                                                                                                                                                                        |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--r-canvas`                                              | Workspace/page background.                                                                                                                                                                                                                                 |
| `--r-surface`, `--r-surface-muted`, `--r-surface-hover`   | Primary, secondary, and hovered surfaces. Hover is a derived surface color, not an alpha value.                                                                                                                                                            |
| `--r-text`, `--r-text-secondary`, `--r-text-muted`        | Main text, supporting text, and quieter descriptions. Muted text remains readable; it is not a disabled-state token.                                                                                                                                       |
| `--r-line`, `--r-control-border`                          | Quiet structural dividers versus identifiable control boundaries. Do not use the weaker divider as the only boundary for an input or active control.                                                                                                       |
| `--r-theme-primary-color`, `--r-theme-primary-fade-color` | Raw primary and primary-hover colors. The historical `fade` name does not guarantee transparency.                                                                                                                                                          |
| `--r-primary-text`, `--r-selected-text`                   | Readable emphasis/selected text. Dark mode deliberately maps these to text colors rather than blindly reusing a user-selected accent.                                                                                                                      |
| `--r-radius`, `--r-control-radius`                        | Custom surface and control corners. Surface radius comes from an explicit Card radius or common radius; control radius comes from common radius. Naive component-specific shapes, such as Material capsule buttons, still belong to their theme overrides. |
| `--r-shadow-soft`                                         | Optional page-surface elevation. Only an explicitly configured common shadow is mapped; no configured shadow means `none`, including the native Naive preset. Plain stays flat.                                                                            |
| `--r-bezier`, `--r-font-mono`                             | Shared easing and monospaced text stack.                                                                                                                                                                                                                   |

`--r-token-*` properties are the provider's mapped inputs. Ordinary page/component styles consume the semantic properties above; they do not replace the mapping, write global palette primitives, or introduce competing `--primary-color` conventions. Add local variables such as `--report-gap` only when the component actually needs an override point. There is no global spacing-token API to invent or assume.

### Provisioning and scope

- **Admin pages:** `AppNaiveGlobalProvider` supplies the effective `NConfigProvider` theme; its descendant `AppStyleProvider` reads `useThemeVars()`, maps tokens, and writes them to `<html>`. The setting store merges the selected style/mode with custom primary overrides. Consume these values directly; do not subscribe to settings or call `getComputedStyle()` per render merely to recolor DOM elements.
- **Independent package consumers:** Import `@ray-template/ui/theme.css`, supply `NConfigProvider` with the chosen light/dark preset, and apply `createRayThemeStyle()` plus `.r-theme-scope` and the matching `.r-template--light`/`.r-template--dark` class to the local DOM owner. [ThemeScopeExample.vue](../apps/docs/examples/ThemeScopeExample.vue) is a type-checked, copyable host example using public exports only. [DemoFrame.vue](../apps/docs/examples/DemoFrame.vue) is the current documentation integration.
- **Resolved variables:** `useThemeVars()` reads an ancestor provider, not a provider returned later by the same component. Put a bridge below that provider, as the admin does, or merge the exported Naive base `common` values with the same common overrides, as the independent example does.
- **Local inheritance:** `.r-theme-scope` redefines semantic aliases where local mapped inputs live. Setting only a child `--r-token-*` while inheriting aliases computed at an ancestor can leave those aliases bound to the ancestor's theme. Custom properties follow the [CSS cascade and inheritance rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties).
- **Behavior services:** `provideUiServices()` supplies translation, chart mode/theme, icons, or persistence to descendants. It does not install a Naive provider or write CSS. The standalone example supplies only mode/chart behavior; a host adds its own locale/translation and other services as needed. Do not wrap existing admin pages in a partial service provider, which would shadow the application services.
- **Missing providers:** With the shared stylesheet but no mapped inputs, semantic properties fall back to system colors (`Canvas`, `CanvasText`, `Highlight`, `ButtonBorder`), 4px radii, and no shadow. This is a readable fallback, not automatic selection of Modern/Material/Naive/Plain. Without the stylesheet, consumers must import it or provide explicit `var()` fallbacks. Naive components keep their own default behavior when their provider is absent.
- **Teleport:** Vue injection follows component ownership, but CSS inheritance follows the DOM. Custom content teleported outside a local theme scope needs a target inside the scope or an explicitly themed target. A local scope does not recolor the entire document; however, the imported stylesheet also defines root color-scheme and generic focus rules, so it is not a completely isolated stylesheet.

### Writing and overriding styles

1. Prefer existing component props/slots and Naive `themeOverrides` before internal selectors. For theme-specific controls use Naive components so density, capsule shapes, disabled states, and focus treatment remain coherent.
2. Put application styles next to their page/component and import them from its entry. Reusable UI styles live with the owning shared component. Use a stable component class (`.r-report`, `.r-report__actions`) or SFC `scoped` styles; scope any necessary `.n-*` override beneath that owner. Avoid broad `button`, `.n-card`, or `.n-input` overrides.
3. Use semantic properties for theme-dependent colors, borders, radii, and shadows. Fixed values remain appropriate for content geometry, optical icon sizing, spacing, breakpoints, and brand/data colors with a documented purpose. Brand assets and ECharts palettes are distinct contracts; CSS `currentColor` is suitable for generic SVG icons, not a replacement for the Canvas chart-theme API.
4. CSS custom properties hold runtime preferences. Sass variables and mixins run at build time; do not use them to implement live color or layout changes. Do not create per-preset selector copies of the same component when token inheritance is sufficient.
5. Respect contrast and focus. Keep border/outline fallbacks for forced colors, do not remove focus indication, and handle reduced motion at the specific transition/animation. Prefer opacity/transform for motion; avoid permanent `will-change` or JS frame loops for simple decoration.

See the [reader's CSS recipe and host example](../apps/docs/guide/appearance.md#custom-css) for complete markup/styles rather than copying palette definitions into this guide.

### Layout and responsive sizing

`AdminShell` owns the live [layout properties](../packages/admin-shell/src/AdminShell.tsx) and [measured dimensions](../packages/admin-shell/src/layout-css-vars.ts):

| Property                     | Meaning                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `--layout-content-padding`   | Configured content padding.                                                                        |
| `--layout-content-gutter`    | Effective padding at the content container, including narrow-screen reduction.                     |
| `--layout-content-max-width` | Configured fixed maximum or `100%` for fluid content. Let the shell apply it.                      |
| `--layout-content-height`    | Available vertical budget after measured header, tabs, and footer; maximized content overrides it. |

Flow pages use natural height. A workspace that needs independent internal scrolling may use `calc(var(--layout-content-height, 100dvh) - 2 * var(--layout-content-gutter, 16px))`, then Flex/Grid with `min-block-size: 0` and an actual scroll owner. Prefer parent-provided height for components outside the shell. Do not add another `100vh` page inside the workspace or subtract guessed header/tab sizes.

Use `minmax(0, 1fr)`, `min-inline-size: 0`, logical sizing/spacing, and content-container queries where available width matters. A query container belongs on an ancestor; use `container-type: inline-size`, not unnecessary size containment that collapses intrinsic height. Breakpoints are explicit content decisions, not invented theme variables: `var()` cannot be used as a media/container query threshold. Avoid treating the legacy `--layout-content-width` (currently measured from the header) as the definitive child width; use normal parent layout instead.

## Page composition

- Limit dashboard and explanatory demo content to 1360px and center it. Business tables continue to honor fluid/fixed-width layout preferences; do not narrow them globally.
- Use `DemoPage` and `HookExample`, grouped by function. Separate interactive content from expandable code. Use native details elements for code, retain keyboard operation, and provide copying.
- Hook examples use two columns when the content container reaches 900px. The layout lab uses settings/preview columns at 760px. Default to a single stacked column below those thresholds. Base decisions on available content width, not only browser-window width.
- Reuse Naive UI and template components before adding small layout structures. Do not invent statistics for visual effect. Read the dashboard version from the actual package configuration and derive shortcuts from visible menus.
- Preserve distinct uses of shared components. For example, resource links remain compact on login pages and cards on the dashboard; visual consistency must not break existing page constraints.

## Loading feedback

- Keep the startup splash self-contained in `apps/admin/index.html`: it must render before the application bundle, use the saved preset and color mode, and retain the bilingual failure/retry state. Animate only opacity and transforms; do not delay application mounting to make an animation visible.
- Content loading uses a thin indeterminate line and an unboxed label. It is feedback rather than an action; avoid borders, filled capsules, or button-like padding around the label. Preserve the 120ms delay for transient operations and immediate feedback while content is remounted.
- Use a labeled native `progress` element without a fabricated percentage. Routine intermediate loading does not need a live-region announcement. Decorative tracks remain hidden from assistive technology.
- Handle reduced motion at each animation: suppress the startup entrance and slow indeterminate movement to a gentle cycle. Do not force every animation to `0.01ms`, which can accelerate infinite effects. Keep system-color borders for progress tracks in forced-colors mode.

## Verification

Choose affected pages and dimensions using [Harness browser verification](../harness/README.md#browser-verification): desktop and 390px widths for layout changes, light/dark themes for color changes, Chinese/English for copy changes, and wrapping for changes to long code or button layouts. Local changes do not trigger a site-wide or all-dimensions matrix. Choose default body-text colors for at least 4.5:1 contrast and control boundaries such as inputs for at least 3:1. User-selected primary colors still need checking in their actual combinations.

Preserve system-color fallbacks for `forced-colors`, visible keyboard focus, and reduced-motion settings. Screenshots, color measurements, and browser checks do not substitute for one another and do not establish coverage of all minimum-version devices.

On wide screens, the login page places branding and login content side by side; narrow screens stack them in document order. The Ray mark is a cucumber cross-section with two seeds representing “呆瓜”; see the [SVG](../packages/icons/src/logo/ray.svg). The example application disables HTML autofill by default, including delayed and Teleport controls. To allow it, supply `autocomplete` explicitly on the target control; use `inputProps` for Naive UI inputs.
