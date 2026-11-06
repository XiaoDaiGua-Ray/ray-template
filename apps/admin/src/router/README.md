# Routing, menus, and permissions

## Switching route sources

After login, open **路由管理** (Route management). Both child pages are registered by the application shell and use the same `admin` role guard.

- **可视化配置** (Visual configuration, `/#/route-management/visual`): Edit pages, groups, redirects, and external links from the active menu tree. Adjust order, roles, visibility, and caching. Validate/export drafts or apply and reload. Saving and reloading use the standard API; mock-database changes apply only to the current browser. Drafts preserve advanced fields such as existing aliases and page props.
- **JSON 配置** (JSON configuration, `/#/route-management/json`): Manage static, browser-local, or backend sources. Edit/import full JSON, validate and preview the tree, and export JSON, standard JSON Schema, and available view IDs. The old `/#/route-management` URL redirects here.

| Source        | Read behavior                                                    | Applying changes                                                                           |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Static routes | Read TypeScript files under [modules](modules)                   | Select static routes and apply                                                             |
| Local JSON    | Read configuration saved in the current browser                  | Import a file or edit JSON, validate, then apply                                           |
| Backend API   | Request deployment-configured `VITE_ROUTE_CONFIG_URL` at startup | Select the backend source and apply. The URL comes from frontend deployment configuration. |

Applying reloads the page and rebuilds route matching, menus, and tabs. With an API URL configured, a new browser defaults to the backend source. Explicit source choices are stored in the current browser. API errors, timeouts, or validation failures fall back to static routes and display the reason on the management page. The shell retains login, management, and 404 pages. An internal home page is added when `/dashboard` is absent.

## Backend and AI contract

Set `VITE_ROUTE_CONFIG_URL=/api/route-config` at deployment, or use an HTTPS URL with CORS enabled. The client sends `GET`, accepts `application/json`, and times out after 5 seconds. Same-origin requests can use session cookies. Standard APIs place the route JSON below in `data` within `{ code: 200, msg: "OK", data }`; import/export uses route JSON directly. Legacy `VITE_ROUTE_CONFIG_URL` also accepts raw JSON. See the [backend contract](../../../docs/guide/backend.md) for the complete read/write API.

```json
{
  "version": 1,
  "routes": [
    {
      "path": "/reports",
      "component": "layout",
      "meta": { "noLocalTitle": "Reports", "role": ["admin"], "order": 20 },
      "children": [
        {
          "path": "overview",
          "name": "REchart",
          "component": "demo/echart",
          "meta": {
            "i18nKey": "menu.Echart",
            "icon": "navigation/echart",
            "keepAlive": true
          }
        }
      ]
    }
  ]
}
```

| Field                                                                           | Rule                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`, `children`                                                              | Relative paths append to the parent group; absolute paths match from the root. Ordinary named and optional parameters are supported. Parameterized routes need `hidden` or `sameLevel`. Groups participate only in menus and permissions. |
| `name`, `component`                                                             | Names are unique. Pages may reference only IDs in the [registry](config/views.ts). With `keepAlive`, the route name must match the page component name.                                                                                   |
| `alias`, `redirect`                                                             | Support absolute leaf-page aliases and internal redirects to configured pages. Direct access through redirects uses the target page's permissions.                                                                                        |
| `props`                                                                         | `true` forwards route params to the page; a JSON object is also supported.                                                                                                                                                                |
| `meta.i18nKey`, `meta.noLocalTitle`, `meta.icon`, `meta.extra`                  | Translation keys take precedence over literal titles. Icons use [IconName](../icons/manifest.ts). Badges can configure text, translation keys, colors, visibility, and icons.                                                             |
| `meta.role`, `meta.hidden`, `meta.env`, `meta.sameLevel`                        | Parent-group and leaf role restrictions both apply. Hidden, environment, and same-level settings affect menus. Same-level mode appends breadcrumbs under the current tab.                                                                 |
| `meta.keepAlive`, `meta.ignoreAutoResetScroll`, `meta.order`, `meta.windowOpen` | Control leaf caching, scroll reset, top-level order, and HTTP(S) external links.                                                                                                                                                          |

[JSON Schema](config/schema.ts) describes the fields. Valibot derives types and validates structure from the same definition; export uses the official JSON Schema converter. [Validation and conversion](config/contract.ts) additionally check view IDs, icons, parameter conflicts, reserved paths, and redirect loops. Limits are 300 records, 8 levels, and 256 KiB. Use TypeScript modules for executable features such as functions, VNodes, and route hooks. Roles control frontend menus/navigation; the backend must still authorize business APIs.

Export the schema directly from the repository for backends or AI tools:

```sh
node --input-type=module -e "import {getRouteJsonSchema} from './src/router/config/json-schema.ts'; console.log(JSON.stringify(getRouteJsonSchema(), null, 2))"
```

## Adding static pages

Register a stable ID and component name in the [view registry](config/views.ts), then use that `component` ID in [initial mock JSON](../mocks/data/routes.json) or route API responses. Match `name` to the component name for cached views. The frontend no longer recursively reads TypeScript menu modules; initial JSON is also the explicit offline-recovery source. Normal startup and edited saves use standard GET/PUT endpoints respectively. Keep Simplified Chinese and English menu copy in the two `menu.json` files.

Application settings and allowlists are in [router-config.ts](../app-config/router-config.ts). Use `useVueRouter()` to read the router outside Vue setup. After changes, run `pnpm harness verify routing` and check menu navigation, direct access, reload, source switching, roles, and caching.
