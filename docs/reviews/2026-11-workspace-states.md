# Neutral workspace and status-page UI — November 2026

## Scope and ownership

This UI change accompanies the routing change that removes protected-home and forced-home navigation. The router owns always-available `/welcome`, `/403`, `/404`, and `/500` destinations, system-page exclusions from business tabs/menus, guards, and failed-navigation recovery. This record covers the views, recovery controls, copy, and visual treatment.

## Findings and changes

- The previous `PageResult` overrode all caller statuses with 500 while displaying a hardcoded Chinese 404 message. Its two recovery actions both depended on configured home state. The component now renders the supplied status, distinct bilingual 403/404/500 explanations, and a semantic page heading.
- A nested `height: 100vh` ignored shell header/tabs/footer height. Status pages now use the available content-height variable, permit natural overflow when needed, and remain centered without forcing another viewport-sized panel.
- Welcome is an intentional workspace with no active business selection. It uses an existing icon, `AppPageHeader`, semantic surface/radius tokens, and native navigation links. It adds no fabricated activity, counts, or placeholder charts.
- Up to six real menu destinations appear. The current visible, role-filtered menu tree is authoritative; account-scoped recent paths only rank those destinations. Hidden branches, external links, detail-only entries, unresolved parameters, and stale history are excluded. An empty list reports a lack of visible navigation entries rather than falsely claiming the account has no permissions.
- Page state uses typography, spacing, and a single clear recovery hierarchy. All four themes retain their own surfaces and shapes. Links collapse to one column below a 600px content container; long labels wrap. Motion is limited to local hover color transitions and is disabled for reduced motion.

## Recovery contract

The neutral action always uses `WELCOME_ROUTE_PATH`. A 500 page shows retry only when the routing utility resolves untrusted `query.from` to an authorized business URL; the query and hash remain intact. Other states may expose a previous-page action when the same utility accepts the history target. These controls use internal router replacement instead of assuming browser history is safe or reloading `/500` into itself.

Naive Result props and `icon`, `default`, and `footer` slots remain available. Title/description overrides are honored. Custom footer content replaces the default actions rather than being overwritten by the wrapper.

## Verification

- `__test__/app/workspace-states.spec.tsx`: 10 tests passed, covering visible-menu/history filtering, removal of unavailable shortcuts, language switching, distinct 403/404/500 rendering, neutral navigation, authorized retry with query/hash, unsafe/system/forbidden retry rejection, and custom copy/slots.
- ESLint passed for all new/changed view code and tests; Prettier formatted the views and locale resources.
- The lead agent owns browser acceptance in desktop/narrow viewports and representative light/dark themes after routing integration stabilizes. The routing agent separately owns guard/tab/source regressions. Unit rendering is not a claim of completed browser acceptance.
