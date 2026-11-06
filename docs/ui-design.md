# Visual design and page layout

The template uses restrained blues and neutral colors. Refinement comes from consistent hierarchy, spacing, and density rather than adding shadows or decoration to every region.

## Themes and dimensions

- Prefer semantic variables in `apps/admin/src/styles/design-system.scss` for page backgrounds, cards, dividers, and text. Naive UI theme overrides live in `apps/admin/src/app-config/design-config.ts`. Keep a consistent color scale instead of inventing a separate theme for each page.
- `apps/admin/src/styles/base.scss` is the global style entry point. `design-system.scss` owns theme variables and basic focus styles; `setting.scss` owns layout dimensions. Keep `naive.scss` limited to shared control defaults. Put layout/component-specific rules in the owning directory to avoid affecting nested Naive UI instances.
- Controls generally use 8px radii, cards 12px, and page sections 20–28px spacing. Use accent colors for selection and primary actions; distinguish body text, descriptions, and eyebrow labels by color hierarchy.
- Use subtle dividers between top bars, tab bars, and sidebars rather than layered shadows. A small number of content cards may use two-layer shadows.
- Page tabs normally show only their names. Reveal the close button on hover or focus; touch users can close the active tab directly.
- The preference drawer uses one or two field columns according to available width. Keep section navigation and reset actions in consistent positions.
- When content is maximized, provide an exit control above the content, accessible by button or Esc.
- Reuse `AppPageHeader` for page headings: an eyebrow, one main title, a short description, and optional actions. Do not replace page hierarchy with long descriptions or equally prominent card headings.

## Page composition

- Limit dashboard and explanatory demo content to 1360px and center it. Business tables continue to honor fluid/fixed-width layout preferences; do not narrow them globally.
- Use `DemoPage` and `HookExample`, grouped by function. Separate interactive content from expandable code. Use native details elements for code, retain keyboard operation, and provide copying.
- Hook examples use two columns when the content container reaches 900px. The layout lab uses settings/preview columns at 760px. Default to a single stacked column below those thresholds. Base decisions on available content width, not only browser-window width.
- Reuse Naive UI and template components before adding small layout structures. Do not invent statistics for visual effect. Read the dashboard version from the actual package configuration and derive shortcuts from visible menus.
- Preserve distinct uses of shared components. For example, resource links remain compact on login pages and cards on the dashboard; visual consistency must not break existing page constraints.

## Verification

Choose affected pages and dimensions using [Harness browser verification](../harness/README.md#browser-verification): desktop and 390px widths for layout changes, light/dark themes for color changes, Chinese/English for copy changes, and wrapping for changes to long code or button layouts. Local changes do not trigger a site-wide or all-dimensions matrix. Choose default body-text colors for at least 4.5:1 contrast and control boundaries such as inputs for at least 3:1. User-selected primary colors still need checking in their actual combinations.

Preserve system-color fallbacks for `forced-colors`, visible keyboard focus, and reduced-motion settings. Screenshots, color measurements, and browser checks do not substitute for one another and do not establish coverage of all minimum-version devices.

On wide screens, the login page places branding and login content side by side; narrow screens stack them in document order. The Ray mark is a cucumber cross-section with two seeds representing “呆瓜”; see the [SVG](../packages/icons/src/logo/ray.svg). The example application disables HTML autofill by default, including delayed and Teleport controls. To allow it, supply `autocomplete` explicitly on the target control; use `inputProps` for Naive UI inputs.
