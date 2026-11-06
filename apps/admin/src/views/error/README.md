## Workspace status pages

The shell provides `/welcome`, `/403`, `/404`, and `/500` independently of business route configuration. The [Welcome view](../welcome/index.tsx) is a neutral workspace; it does not select a business page or add a tab. The error views use `PageResult` with their actual status and the corresponding Chinese/English `workspaceStates` copy.

`PageResult` retains Naive UI Result props and the `icon`, `default`, and `footer` slots. Its own heading uses `AppPageHeader`; callers can override `title` and `description`, add details, or replace recovery controls through the footer slot. Styling uses the shell's available content height and shared semantic tokens rather than a nested `100vh` page.

Recovery never assumes `/dashboard` or a pinned home exists. Every status page offers the neutral workspace. A 500 page offers retry only when `query.from` passes `resolveLandingPath`; previous-page navigation uses the same validation on the router's history state. These are internal, authorized business destinations with their query/hash preserved. System, external, missing, and unauthorized targets fall back to Welcome instead of creating a retry loop.

Welcome shortcuts are drawn only from the current visible menu tree. Account history changes their order but cannot restore an unavailable destination. Hidden branches, external entries, same-level details, and unresolved parameter paths are excluded. At most six links appear; if no visible entries exist, the page explains that navigation configuration or access may need attention.

Routing registration, guard behavior, tab ownership, and error redirects belong to the router/menu stores. UI regressions live in `__test__/app/workspace-states.spec.tsx`; routing regressions separately establish navigation behavior.
