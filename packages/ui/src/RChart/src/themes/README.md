# RChart themes

Four styles live in `modern/`, `naive/`, `material/`, and `plain/`. Each has separate light and dark JSON files. Filenames are ECharts registration names: for example, `modern/ray-modern.json` → `ray-modern` and `modern/ray-modern-dark.json` → `ray-modern-dark`.

| Style    | Palette and rendering                                              |
| -------- | ------------------------------------------------------------------ |
| Modern   | Ray blue, cool grid colors, dashed dividers, and subtle area fills |
| Naive    | Emerald green, solid grids, and smaller corner radii               |
| Material | Purple tones, thicker lines, larger radii, and soft area fills     |
| Plain    | Muted colors, dotted grids, square bars, and shadow-free tooltips  |

When editing with the [ECharts theme builder](https://echarts.apache.org/zh/theme-builder.html), export JSON to the appropriate directory. The loader registers themes by filename; filenames must be unique even across directories. A light-only theme remains active for both modes. Adding a `-dark.json` variant enables switching with the application theme. Explicit colors/styles in business `options` still take precedence.

Legacy `macarons` and `macarons-dark` themes were removed. Pages with hardcoded names can omit `theme` to follow the interface style or use a new theme registration name.
