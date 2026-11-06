# UI and component refinements — November 2026

This follow-up preserves the preceding quality-review changes and covers pagination API migration, app diagnostics, the custom-style contract, PNG clipboard capture, and icon selection. No commit, push, or deployment is part of this work.

## Decisions and implementation

- TablePro pagination uses the current `onUpdatePage` / `onUpdatePageSize` events (and their `onUpdate:*` forms). Deprecated nested and table-level change aliases are excluded from its public types and stripped before native forwarding. Reader documentation includes the migration.
- The former `__ray-template` entry only retained locale-configuration checks after removal of the root-route convention. Those checks still detect cross-field drift that individual TypeScript unions cannot. They now live in the app-local `doctor` module, report development diagnostics after mounting, and do not reject a successfully mounted application. A separate workspace package would add no reusable boundary here.
- [The engineering style contract](../ui-design.md) and [reader guide](../../apps/docs/guide/appearance.md#custom-css) explain semantic token consumption, local theme scope, provider ownership, native overrides, Teleport, runtime layout sizing, motion, and explicit exceptions. A public-export-only `ThemeScopeExample.vue` is included in documentation type checking.
- TablePro exposes a default-visible copy-image action, `showCopyImage`, `copyImageOptions`, and the `copyImage()` instance/hook method. Capture includes the visible NDataTable header, body and native pager, excluding the page, search, toolbar and unrelated slots. It does not synthesize unmounted virtual rows or fetch all backend data. Promise-backed PNG clipboard data preserves the originating click; capture is lazy and cancellation owns temporary snapshot cleanup.
- The icon family was retained where it already fits. Five assets were selected from the existing [Iconfont collection](https://www.iconfont.cn/collections/detail?cid=51731), with upstream IconPark attribution and Apache-2.0 licensing retained. Table/status glyphs were replaced, capture/external-link glyphs added, and misleading icon uses corrected. Existing names remain compatible.

| Asset                  | Iconfont ID | Reason                                                            |
| ---------------------- | ----------- | ----------------------------------------------------------------- |
| `navigation/table`     | 43963947    | A table grid distinguishes data tables from bar-chart navigation. |
| `status/success`       | 43971726    | Circular check matches the existing question/warning containers.  |
| `status/error`         | 43971709    | Circular error mark completes the status family.                  |
| `action/copy-image`    | 43970501    | Capture frame denotes the table-region PNG action.                |
| `action/external-link` | 43971751    | External navigation is distinct from a three-node share action.   |

The five selected assets retain their source path geometry; rendered SVG source path checksums were compared with the local files. Only export metadata, colors, optical viewBoxes and outline reinforcement were adapted. Generic assets keep `currentColor`; brand marks are unchanged. The icon catalog now contains 67 assets. The icon-library shortcut uses the icon-library glyph, forward arrows point right, and external resource links use the new external-link mark. Dashboard shortcuts now traverse visible menu groups instead of silently disappearing when destinations are nested.

## Verification record

Verification is complete. Local evidence is under `.harness-local/refinements/`.

- `pnpm harness verify all` passed with 100 files / 514 tests, environment and Harness validation, API/package boundaries, icons, types, lint, formatting and both builds. The report is `.harness-local/runs/all-YYEdpT/report.json`.
- A final browser-discovered grouped-column defect was fixed: applying a fixed position only to a group pinned its header but left body columns moving. Explicit group pin/unpin now cascades to descendants in local and controlled modes without mutating source columns. Final whole-suite verification passed **100 files / 516 tests**. Final type checking, affected table regressions, admin build and documentation check/build also passed, and the combined preview was refreshed.
- Icon verification passed 3 files / 10 tests. The five selected path geometries match their observed Iconfont sources. Chrome rendered all four circular status glyphs at matching optical bounds; the new table/capture/external-link glyphs and Dashboard navigation cues were inspected. Grouped visible shortcuts now appear, while hidden ancestors remain excluded.
- Browser clipboard output excludes page/search/toolbar content and preserves table header/body/pager, theme and current viewport. The light fixture yielded 3932 × 1128 PNG; a dark, horizontally scrolled fixed-column fixture yielded 1460 × 1228 PNG with its external SVG icon intact. The final compiled application also produced a 754 × 564 PNG, 106,146 bytes, through the actual ClipboardItem data supplied to the native Chrome write call; the button returned to enabled and no temporary snapshot remained.
- A virtual-row fixture at scrollTop 400 had 10 mounted rows and 6 intersecting the viewport. Its 1460 × 628 PNG contains that visible region, including partial edge rows, instead of synthesizing unmounted rows. In an independent Chrome DevTools session, the native clipboard promise fulfilled, the copy button reenabled, scrollTop remained 400 and the snapshot count returned to zero; the same flow also completed without instrumentation.
- Real group-pin geometry was checked at horizontal offsets 120 and 200: header and body name cells both remained at x = 309.8984375 with sticky positioning. This verifies the new grouped layout behavior as well as the capture scenario.
- Screenshot, pagination and diagnostics regressions cover unsupported/denied APIs, rejected or empty rendering, duplicates, cancellation, form/radio isolation, static SVG validation, modern callback forwarding, and diagnostic error containment. The doctor warning marker is absent from production JavaScript.

A warm browser-API capture/write sample took about 313 ms on this machine. This is one observation, not a cross-device or OS clipboard benchmark. The Browser Use adapter exposes an isolated clipboard: exact generated PNG items were transferred through its documented clipboard bridge into a paste fixture for visual inspection. One adapter session left its completion state pending despite holding a valid image; independent native Chrome API checks completed normally. No application timeout or false success shortcut was introduced to hide that discrepancy.

The missing external-SVG glyph reproduced during QA was fixed at the snapshot boundary. Only static local symbols and same-origin public SVG/spritemap references are expanded, with deduplicated bounded requests, cancellation, independent viewBoxes/currentColor and no imported IDs, handlers or resources. Unsupported active embedded content and non-static SVG dependencies fail explicitly. Browser-managed clipboard support, permission and the originating user action remain requirements; Safari/Firefox and a real Wujie host were not exercised.

Test-only DOM probes, clipboard observers and sizing overrides were cleared, and the native development page's original light-mode preference was restored. The updated production preview remains at `http://127.0.0.1:9530/ray-template/`.

## Tool and environment boundaries

Automatic approval review rejected fetching/executing the remote Modern Web Guidance package. Read-only MDN/WebKit references and installed source were used instead; the rejected execution was not retried through another launcher. A later native full-window accessibility read was rejected because it could include unrelated tabs; subsequent verification uses the owned test tab, scoped developer inspection, and the generated image files. Neither restriction requires weakening the implementation or granting broader access.
