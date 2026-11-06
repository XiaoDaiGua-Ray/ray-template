# SVG icons

Icon names include their relative directory instead of relying on globally unique filenames:

```tsx
import { RIcon } from '@/components'
import type { IconName } from '@/icons'

const name: IconName = 'directional/resize_h'
<RIcon name={name} />
```

`RIcon.name`, route `meta.icon`, sidebar logos, and icon wrappers share the strict `IconName` union. Completion for `name` includes full group paths; TypeScript rejects bare names and nonexistent paths. Types are generated from files, not obtained by TypeScript reading the filesystem.

## Groups

| Directory     | Purpose                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| `action`      | Search, reload, close, fullscreen, settings, printing, and other actions |
| `directional` | Arrows, directions, row start/end, and resizing directions               |
| `navigation`  | Page and feature navigation                                              |
| `logo`        | Brand and product marks                                                  |
| `status`      | Error, help, and other status indicators                                 |
| `system`      | Language, light/dark themes, and system preferences                      |

Use lowercase letters, digits, underscores, or hyphens for filenames/directories, starting with a letter. SVGs must be inside a group. Nesting is supported: `business/orders/approved.svg` becomes `business/orders/approved`. Different groups may contain the same filename.

Monochrome icons use `currentColor`, with `none` for intentional empty areas. Brand marks retain original colors; `color` does not necessarily override every color. Avoid embedded scripts, event handlers, and external resources.

For ordinary buttons, `<RIcon name="action/search" />` uses the default 20 px box. Use `size="1em"` when a containing component, such as a menu, already defines icon sizing. Compact close buttons, inline hints, and brand marks can set explicit dimensions. Compare new generic SVGs with existing line icons at the same size: use a square viewBox and a subject occupying about 85%, allowing more whitespace for arrows or ellipses. Use `currentColor` and inspect small-size strokes/spacing on both light and dark backgrounds.

See the [source and license inventory](../ICON-SOURCES.md). Legacy Excel export, Office, and login illustration icons were retired. Historical route/menu reads migrate them to download, table, and generic-page icons respectively.

Choose a glyph for the actual interaction: `navigation/table` denotes a data grid, `action/external-link` denotes an external destination, `action/shared` denotes sharing, and `action/copy-image` denotes region capture. Forward navigation uses a right arrow without rotating an expansion chevron. Status glyphs share a circular container and comparable optical size; keep that family coherent when adding states.

## Generation and injection

- Adding, editing, deleting, or moving an SVG causes the development server to check/synchronize `packages/icons/src/manifest.ts`. Adding/removing an entire group restarts the server automatically.
- `pnpm dev`, `build`, `dev-build`, `report`, and `check` generate the manifest first. Direct Vite calls also synchronize through the plugin at startup/build time. `typecheck` and `icons:check` remain read-only. `pnpm icons:generate` can run separately. Maintain updated manifests alongside SVG changes. Generated files use project Prettier settings and preserve ESLint declaration-spacing rules.
- `pnpm icons:check` checks manifest/directory consistency; `pnpm typecheck` and `pnpm check` run it. Modify the generator rather than maintaining the union type manually.
- Each top-level group produces a separate hashed SVG spritemap. The Spritemap plugin turns generated group addresses into development/production paths respecting the Vite base. `RIcon` selects the address from the name's group, then references a symbol ID containing the full path.
- `/svg-icons` provides group filtering and path search. Clicking an icon copies TSX usage by default; Vue template format is also available.

At read boundaries, `resolveIconName` migrates bare logo/menu icon names from older caches only when the filename is unique. New code must use full paths; do not widen component types to accept bare names.
