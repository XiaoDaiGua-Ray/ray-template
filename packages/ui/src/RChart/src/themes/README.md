# RChart themes

Four styles live in `modern/`, `naive/`, `material/`, and `plain/`. Each has separate light and dark JSON files. Filenames are ECharts registration names: for example, `modern/ray-modern.json` → `ray-modern` and `modern/ray-modern-dark.json` → `ray-modern-dark`.

| Style    | Palette and rendering                                              |
| -------- | ------------------------------------------------------------------ |
| Modern   | Ray blue, cool grid colors, dashed dividers, and subtle area fills |
| Naive    | Emerald green, solid grids, and smaller corner radii               |
| Material | Purple tones, thicker lines, larger radii, and soft area fills     |
| Plain    | Muted colors, dotted grids, square bars, and shadow-free tooltips  |

The chart canvas matches the corresponding Naive UI card surface, including the warm Material and cool Modern dark surfaces. Title/body text, legends, axis labels, tooltip surfaces, and pie separators follow that same palette. Plain keeps low-saturation categorical colors instead of six indistinguishable gray series. The six-color sequences are designed as a set; a custom application primary color does not automatically replace a data series color.

Use the active pointer color for crosshairs rather than copying the much softer divider/grid color. Naive and Plain need this distinction in both color modes. Text is checked at 4.5:1 and series/pointer marks at 3:1 against the chart canvas; alpha channels are composited first. Decorative area fills and grid lines stay subtle, while the pointer/tooltip communicates values. These checks do not certify every business chart: overlapping marks, color-vision differences, and values conveyed only by decorative grids require chart-specific review. Enable `showAria` for descriptions/decals, and supply accessible data where the visualization requires it.

`__test__/components/chart-themes.spec.ts` checks all eight registration names, surface mappings, contrast pairs, and loading masks. Loading uses the selected theme's colors; transparent or invalid custom backgrounds fall back to a mode-appropriate surface, and explicit `loadingOptions` still take precedence.

When editing with the [ECharts theme builder](https://echarts.apache.org/zh/theme-builder.html), export JSON to the appropriate directory. The loader registers themes by filename; filenames must be unique even across directories. A light-only theme remains active for both modes. Adding a `-dark.json` variant enables switching with the application theme. Explicit colors/styles in business `options` still take precedence.

Legacy `macarons` and `macarons-dark` themes were removed. Pages with hardcoded names can omit `theme` to follow the interface style or use a new theme registration name.
