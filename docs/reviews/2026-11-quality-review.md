# Quality review — November 2026

## Scope and acceptance

This review covers all shared component wrappers, application wrappers, generic and application hooks/utilities, the four visual presets, startup/content loading, and all eight RChart palettes. The source audit follows compatibility exports to their owning implementations and records retained behavior as well as changes.

The accepted follow-up scope removes the protected-root-tab and forced-root-redirect convention. An empty workspace must remain usable when no business page is selected, including when permissions or the route source omit the former dashboard. Welcome and error pages must work without relying on a particular business route. TablePro must hide printing by default and retain an explicit opt-in through its configurable action area.

Acceptance requires:

- Distinct, coherent plain, Naive UI, Material, and modern themes in light and dark modes; actual chart canvases, labels, tooltips, and loading feedback must match.
- Startup/content loading that communicates status without a button-like label, respects reduced motion, and offers recovery from startup errors.
- Per-component and per-method findings, contract comments, meaningful regressions, and no speculative performance claims.
- Any business tab can close; closing the last/all tabs reaches an empty welcome workspace. Permission/source changes and direct unknown URLs cannot activate an unavailable dashboard.
- Integrated welcome and error pages with safe recovery actions, bilingual copy, and narrow-screen support.
- TablePro's default actions omit printing; explicit printing, column controls, refresh, export, and configured slots continue to work.

## Detailed inventories

- [Visual presets, loading, and chart themes](2026-11-ui.md)
- [Component wrappers and component-local hooks](2026-11-components.md)
- [141 hook/utility methods in 44 owning modules](2026-11-hooks-utils.md)
- [Workspace welcome and error-page design](2026-11-workspace-states.md)
- [Route ownership, permissions, and empty-tab behavior](2026-11-routing.md)

## Integration evidence

The accepted scope is implemented and integrated. The review used three implementation agents with separate ownership, a complementary read-only review, and lead-agent browser/command verification. No commits, pushes, or deployments were performed.

### Command verification

- `pnpm harness verify all` passed on Node 26.13.0 / pnpm 12.16.1: 94 test files / 470 tests, environment and Harness checks, API/package boundaries, icon synchronization, application/package/test types, zero-warning ESLint, formatting, admin build, and documentation types/build. Report: `.harness-local/runs/all-dyiXvi/report.json`.
- The final cross-review fixes added navigation-error ownership, system-title locale updates, empty-target action disabling, and retryable initialization. The final affected set passed 5 test files / 31 tests: router initialization, navigation errors, sidebar/tab methods, reused theme state, and workspace status UI. This is an overlapping targeted rerun, not 31 additional tests to add to the full-run count.
- Final `pnpm typecheck`, affected-code ESLint, admin production build, and `pnpm docs:check` passed after those fixes. The final outputs were combined with `scripts/assemble-pages.mjs` and checked through a local production preview.
- Final repository-wide formatting, Harness integrity, and `git diff --check` passed. An incidental editor-dictionary addition (`rgba`) was preserved; only its surrounding JSON formatting was normalized. No staged changes were introduced.
- The lead's AST comment audit found no incorrect parameter names, required-tag ordering, or initial blank-line violations in documented methods across hooks, utilities and shared UI. The two public overload implementations share their declaration contracts; the function component follows the convention against component-header JSDoc. The final theme hook reuses its reactive getter/actions/translator rather than recreating 21 getter refs on every snapshot read; theme and locale changes remain live.

### Browser observations

- Chrome at 1440 × 1000: inspected the dashboard in all four light/dark presets and the live chart page in all eight palettes, including crosshairs and tooltips. The same ECharts instance survived every style/mode switch; no console errors were reported on the chart page.
- Content loading: the real 800 ms demo opens and closes the indicator; the public `useSpinning` API also produced the quiet line and transparent, borderless label with no button. At 390 × 844, English/dark loading stays inside the viewport, the document remains 390 px wide, reduced-motion sweep is 6 s, and forced-color track/fill borders remain visible.
- Startup probe: a local server substitutes only the entry module in the actual served HTML. Saved Material/dark and English settings restore before Vue; reduced motion removes entry animation and slows the line to 6 s. An actual missing module resource and a missing named export both show the failed/reload UI. Reload changes the document time origin. These are controlled failure probes, not evidence of an external outage.
- Form: blank submission displays field errors; Enter in a populated single-line input submits; Enter in the textarea inserts a newline without submitting again. No console errors were reported.
- Drag card: real pointer dragging changes the card transform; toggling drag off/on remains usable; closing the last card removes its owned Teleport container. No console errors were reported.
- Flow: readonly toggle, reset, graph readback and return to editing work; no console errors were reported.
- Screenshot hook: the actual PNG-preview action yields a complete 1136 × 164 image. The normal HookExample consumer no longer warns about an absent optional documentation injection.
- Barcode: changing text and color updates the existing SVG node; responsive width matches its container. Iframe eager and lazy examples both load the local document. Segment selection updates its displayed state. Documentation CollapseGrid expands and collapses with keyboard input, and the dropdown example selects an action by keyboard.
- Modal/lock screen: card and dialog widths measure 480/380 px and Esc restores the trigger focus. In the isolated demo account, empty lock validation, bilingual copy, successful locking, incorrect unlock feedback and successful unlocking work without application errors. A transient Chromium `aria-hidden` focus warning appeared during native modal dismissal; the final focused trigger is visible and not hidden. No library-wide focus override was introduced to suppress this warning.
- TablePro: default remote tables expose refresh, columns, fullscreen and More actions, with no print entry. The menu updates striped state; request refresh settles with data. The printing example explicitly enables its print item. Production CSV selection invokes a real download (`data.csv`, 1,922 characters in that fixture, expected quoted headers). English/dark controls fit a 390 px viewport; the table scrolls within its container.
- Empty workspace: the actual Close all action and closing the final former-dashboard tab both reach `/welcome`, with zero tags, no current menu/key and an empty KeepAlive include list. Welcome/status routes never become business tabs.
- Permission/source boundary: a separate browser context used a validated local source with one public route and one admin-only route, omitting dashboard. A member session landed on welcome, saw only the public entry, received 403 for the admin route and 404 for `/dashboard`. Changing the public route to admin-only pruned its old tag/cache on reload and left an empty workspace with no invented navigation entry.
- URL restoration: changing only query/hash kept one tab; returning through that tab restored `/quality/public?filter=two#detail` exactly. English system titles update with locale. Empty English/dark welcome and 500 layouts have no horizontal overflow at 390 × 844.
- Error recovery: an intentionally rejected current route loader reached `/500` with a safe retry target; Back to workspace recovered. A delayed failure from an older route left the newer successful route active. These probes used temporary, local route records and were removed afterward.
- Production artifact: the final compiled app loads and removes its splash, demo login lands on welcome, and built documentation iframes load from the combined subpath. The embedded navigation demo's Close all action also reaches welcome with zero tags and no active menu; no application console errors were reported in those production checks.

Temporary screenshots and probes are kept under `.harness-local/quality-review/`; they are not production assets. Command tests, rendering, controlled failure probes, and physical-device coverage are recorded separately.

The temporary development, documentation-development and failure-probe servers were stopped. The combined production preview remains available at `http://127.0.0.1:9530/ray-template/` for local review.

### Compatibility and verification limits

`useAppRoot` and stored `appRootRoute` remain deprecated compatibility metadata with no landing, permission, protected-tab or startup-validation effect. Existing callers that inverted CollapseGrid's erroneous update event should remove that inversion. Printing remains available through the instance API; its default toolbar visibility is now opt-in.

Chrome desktop and emulated narrow viewports were tested. No Safari/Firefox/device matrix, physical barcode scan, paper printing, remote CI, deployment, or real-backend acceptance is claimed. Unit tests cover the same-page initialization retry; a real Wujie host was not used. Native printer behavior is unchanged; this task verifies the new menu visibility and existing print contracts, not printer hardware.

Builds still report large chunks and two ineffective dynamic imports in the existing route-contract/layout graph. No universal speedup or bundle-size target is claimed. The concrete improvements remove duplicate observer/listener work, unnecessary getter and permission allocations, per-character random calls, per-byte fallback array entries, and eager screenshot-renderer loading while retaining error handling and configuration contracts.
