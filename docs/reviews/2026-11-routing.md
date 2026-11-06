# Neutral workspace and routing review — November 2026

## Resulting contract

The shell no longer requires or protects a business home route. `/welcome` is the neutral state with no active business page. `/403`, `/404`, and `/500` are recovery states. All four are outside business menus, tab persistence, recent/favorite navigation, and KeepAlive. Their paths, descendants, aliases, and route names are reserved against local or remote JSON collisions.

Business sources may omit `/dashboard` entirely or restrict it to a role. No fallback dashboard is injected. Startup does not validate a legacy root preference. The menu store follows the actual Router location instead of selecting the cached root or the first permitted menu.

## Changes traced across owners

| Owner                         | Previous implicit behavior                                                                | Result                                                                                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `router/app-route-modules.ts` | Added a bundled dashboard when a custom source omitted it.                                | Registers the business source plus explicitly owned management routes.                                                                                                                      |
| Shared route contract         | Required dashboard to be unrestricted; had no host status-path reservation.               | Treats dashboard like any business view; accepts host `reservedPaths`. `homePath` is ignored and deprecated for compatibility.                                                              |
| `router/routes.ts`            | Login/management and a catch-all error view were the shell routes.                        | Registers Welcome, 403, 404, 500 and a catch-all forwarding the attempted URL. `getSystemRoutes` is reused by isolated documentation examples.                                              |
| Permission guard and login    | Login and denied navigation returned to the configured root.                              | Login returns only to an explicitly requested, existing, authorized local business URL, otherwise Welcome. Forbidden direct links show 403. Query/hash are preserved.                       |
| Landing/recovery resolver     | Fell back to dashboard, including when absent or inaccessible.                            | Rejects external/control-character targets, missing/forbidden/system targets, and redirect cycles. Validates string redirect chains without replacing the original URL. Default is Welcome. |
| Router error handler          | Page import failures lacked a consistent status recovery destination.                     | Navigates to 500 with `query.from`; failure of the 500 route itself does not loop.                                                                                                          |
| Menu bootstrap                | Restored a cached/first-menu active tab even without an active business URL.              | Restores only valid permitted tags, excludes shell states, and derives active selection from the actual URL.                                                                                |
| URL synchronization           | Query/hash were dropped from restored tags.                                               | One tag per concrete pathname retains its latest full URL. The sidebar key stays canonical.                                                                                                 |
| Tab actions and MenuTag       | Root and final tabs could not close; close-all recreated the root.                        | Every business tab closes. Active removal selects its neighbor; final/all removal opens Welcome with no active menu or breadcrumb.                                                          |
| KeepAlive                     | Closed/revoked component names could remain allowed.                                      | Prunes names whenever the open tab set changes. Status pages never enter the allowlist.                                                                                                     |
| Account/role changes          | Menu rebuilding could recreate a still-visible old-account page during logout.            | Account removal clears tabs/active state without recreating them. Revoked current pages show 403; revoked tags and cached names are removed.                                                |
| Settings and logo             | Default logo and historical root preference implied dashboard availability.               | Default logo targets Welcome. One-time migration changes only the recognizable stock logo; explicit custom targets remain. Legacy root fields are inert.                                    |
| Demo/docs                     | Controls appeared to configure a protected home; documentation fallback forced dashboard. | Removes misleading root controls, documents compatibility-only access, and shares neutral/status routes with documentation iframes.                                                         |

## State and compatibility details

- `menuKey` remains the canonical sidebar key. `currentMenuOption.fullPath` identifies the active tab's exact URL. Query/hash changes update the existing concrete-path tab rather than adding duplicates.
- System states clear active business selection and breadcrumbs without closing unrelated open business tabs. Explicit close-all clears the list and its cached view names.
- Hidden and `sameLevel` business routes retain their established behavior. Direct same-level pages do not fabricate a default parent tab. Updating a same-level URL replaces its breadcrumb entry instead of accumulating query variants.
- Existing tab cache keys and array format remain readable. Restored entries are re-resolved against the current Router and role; saved metadata is not trusted. The old persisted `menuKey` no longer controls active navigation.
- Navigation history retains its per-account, path-only format. System states are filtered from reads and writes; visible shortcuts still intersect saved paths with authorized menus.
- `useAppRoot`, `appRootRoute`, and `redirectRouterToDashboard` remain only for existing callers. The first two access an inert preference; the last aliases neutral `redirectRouterToWorkspace`. None grants permission, protects a tab, selects a business landing page, or imposes a startup requirement.

## Verification

The focused suite `pnpm test:run __test__/router __test__/hooks/useSiderBar.spec.ts __test__/hooks/useAppRoot.spec.ts __test__/layout/navigation-history.spec.ts __test__/layout/preferences.spec.ts __test__/app/workspace-states.spec.tsx` passed 9 files / 80 tests. It covers no-dashboard sources, reserved collisions, login redirects, query/hash restoration, closing the last/root/all tabs, neighbor operations, status exclusion, account removal, role revocation, KeepAlive pruning, logo migration, and safe status actions. Router error tests cover failed business-page and error-page imports without recursion.

After the final URL-sanitizer and legacy-icon typing adjustment, the affected permission/preferences rerun passed 2 files / 26 tests. `vue-tsc --build`, ESLint with zero warnings, and Prettier checks passed for the routing-owned changes.

The complementary integration review found and corrected three further boundaries:

- A superseded lazy import could fail after a newer successful or pending navigation and incorrectly open 500. Error handling now tracks normalized navigation-target identity, including terminal duplicated/aborted attempts, while cancelled old attempts cannot take ownership back. A three-case regression covers newer successful, pending, and duplicate navigation. Errors thrown by a component's leave guard before the tracking guard remain ordinary Router rejections; this conservative case does not claim ownership it cannot establish.
- System-page titles did not follow language changes because no business menu was active. The title watcher now derives the active route's translated metadata. Welcome and 403 title changes are covered. Target-specific tab actions are disabled when a system page has no active target.
- A rejected startup Promise prevented later same-page or microfrontend remount attempts from refetching route configuration. Failed initialization now releases that Promise; successful initialization and guard registration remain shared. The retry/concurrent-initialization regression passed 1/1; this tests Router initialization ownership, not an external Wujie host.

The final race/title suite passed 2 files / 14 tests; its source changes also passed type checking, lint, and formatting. The integrating agent records full checks and browser evidence in the [combined review](2026-11-quality-review.md). Server-side authorization remains unchanged. A remote configuration failure before application startup still uses the existing boot-error state; the 500 route handles owned navigation failures after Router setup. No deployment or publication was performed.
