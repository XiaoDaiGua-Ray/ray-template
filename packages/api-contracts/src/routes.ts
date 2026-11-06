import * as v from 'valibot'

const text = v.pipe(v.string(), v.minLength(1), v.maxLength(256))
const finiteNumber = v.pipe(v.number(), v.finite())
const title = v.union([text, finiteNumber])
const icon = v.pipe(text, v.regex(/^[\w-]+\/[\w-]+$/))
const segment = '(?:[\\w~.-]+|:[A-Za-z_]\\w*\\??)'
const absolutePath = v.pipe(
  text,
  v.regex(new RegExp(`^/${segment}(?:/${segment})*$`)),
)
const unsafeProp =
  /^(?:[oO][nN]|innerHTML$|outerHTML$|srcdoc$|__proto__$|constructor$|prototype$)/
const viewProps = v.pipe(
  v.record(v.string(), v.unknown()),
  v.check(
    (value) => Object.keys(value).every((key) => !unsafeProp.test(key)),
    'Unsafe view prop.',
  ),
  v.metadata({ propertyNames: { not: { pattern: unsafeProp.source } } }),
)

const routeFields = {
  path: v.pipe(
    text,
    v.regex(new RegExp(`^/?${segment}(?:/${segment})*$`)),
    v.description(
      'Absolute or relative child path. Supports named and optional parameters.',
    ),
  ),
  name: v.optional(
    v.pipe(
      text,
      v.regex(/^[A-Za-z_][\w.-]*$/),
      v.description('Unique Vue Router name. Required for keepAlive.'),
    ),
  ),
  component: v.optional(
    v.pipe(
      text,
      v.description('Registered view ID. Use layout for a menu group.'),
    ),
  ),
  alias: v.optional(
    v.pipe(
      v.union([
        absolutePath,
        v.pipe(v.array(absolutePath), v.minLength(1), v.maxLength(16)),
      ]),
      v.description('Absolute alternative path(s) for a leaf.'),
    ),
  ),
  redirect: v.optional(
    v.pipe(
      absolutePath,
      v.description('Absolute path of another configured page.'),
    ),
  ),
  props: v.optional(
    v.pipe(
      v.union([v.boolean(), viewProps]),
      v.description('Pass route params (true) or a JSON object to the view.'),
    ),
  ),
  meta: v.strictObject({
    i18nKey: v.optional(
      v.pipe(text, v.description('Translation key for the menu title.')),
    ),
    noLocalTitle: v.optional(
      v.pipe(title, v.description('Literal title if i18nKey is absent.')),
    ),
    icon: v.optional(
      v.pipe(icon, v.description('IconName from src/icons/manifest.ts.')),
    ),
    role: v.optional(
      v.pipe(
        v.array(title),
        v.maxLength(32),
        v.description(
          'Allowed roles. Omitted or empty means any authenticated role.',
        ),
      ),
    ),
    hidden: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          'Hide from the menu. Direct navigation still uses the role guard.',
        ),
      ),
    ),
    sameLevel: v.optional(
      v.pipe(
        v.boolean(),
        v.description('Append a breadcrumb without replacing the current tab.'),
      ),
    ),
    order: v.optional(
      v.pipe(finiteNumber, v.description('Menu sort order at the top level.')),
    ),
    env: v.optional(
      v.pipe(
        v.union([text, v.pipe(v.array(text), v.maxLength(16))]),
        v.description('Vite mode(s) in which the menu item is visible.'),
      ),
    ),
    windowOpen: v.optional(
      v.pipe(
        v.string(),
        v.maxLength(2048),
        v.regex(/^[Hh][Tt][Tt][Pp][Ss]?:\/\//),
        v.description('Open this HTTP(S) URL in a new tab.'),
      ),
    ),
    ignoreAutoResetScroll: v.optional(
      v.pipe(
        v.boolean(),
        v.description('Keep the content scroll position on navigation.'),
      ),
    ),
    keepAlive: v.optional(
      v.pipe(
        v.boolean(),
        v.description(
          'Keep the view mounted. name must match the registered view name.',
        ),
      ),
    ),
    extra: v.optional(
      v.pipe(
        v.strictObject({
          label: v.optional(title),
          i18nLabel: v.optional(text),
          icon: v.optional(icon),
          show: v.optional(v.boolean()),
          type: v.optional(
            v.picklist([
              'default',
              'primary',
              'info',
              'success',
              'warning',
              'error',
            ]),
          ),
        }),
        v.description('Optional menu badge.'),
      ),
    ),
  }),
}

type RouteFields = v.InferOutput<
  v.StrictObjectSchema<typeof routeFields, undefined>
>

export type RouteConfigRecord = RouteFields & { children?: RouteConfigRecord[] }

export const routeRecordSchema: v.GenericSchema<RouteConfigRecord> =
  v.strictObject({
    ...routeFields,
    children: v.optional(
      v.pipe(
        v.array(v.lazy(() => routeRecordSchema)),
        v.minLength(1),
        v.maxLength(300),
      ),
    ),
  })

export const routeConfigSchema = v.pipe(
  v.strictObject({
    version: v.literal(1),
    routes: v.pipe(v.array(routeRecordSchema), v.maxLength(300)),
  }),
  v.title('Ray Template route configuration'),
)

export type RouteConfig = v.InferOutput<typeof routeConfigSchema>

export const routeViewPermission = (view?: string) =>
  view === 'system/users' ? 'users:read' : void 0

export function filterRuntimeRoutes(
  config: RouteConfig,
  options: {
    role: string | number
    permissions: readonly string[]
    demoEnabled: boolean
  },
): RouteConfig {
  const { role, permissions, demoEnabled } = options

  if (!permissions.includes('routes:read')) return { ...config, routes: [] }

  const accessible = new Map<string, RouteConfigRecord>()
  const collect = (
    routes: RouteConfigRecord[],
    parent = '',
  ): RouteConfigRecord[] =>
    routes.flatMap((route) => {
      const permission = routeViewPermission(route.component)

      if (
        (route.meta.role?.length && !route.meta.role.includes(role)) ||
        (permission && !permissions.includes(permission)) ||
        (!demoEnabled && route.component?.startsWith('demo/'))
      )
        return []

      const path = route.path.startsWith('/')
        ? route.path
        : `${parent}/${route.path}`

      if (route.children)
        return [{ ...route, children: collect(route.children, path) }]

      for (const address of [path, ...[route.alias ?? []].flat()])
        accessible.set(address.toLowerCase(), route)

      return [route]
    })

  // 重定向在角色、视图权限与演示开关裁剪之后再解析，避免保留空壳入口。
  const canResolve = (route: RouteConfigRecord) => {
    const visited = new Set<RouteConfigRecord>()
    let current: RouteConfigRecord | undefined = route

    while (current?.redirect) {
      if (visited.has(current)) return false

      visited.add(current)
      current = accessible.get(current.redirect.toLowerCase())
    }

    return !!current && !current.meta.windowOpen
  }
  const prune = (routes: RouteConfigRecord[]): RouteConfigRecord[] =>
    routes.flatMap((route) => {
      if (!route.children)
        return !route.redirect || canResolve(route) ? [route] : []

      const children = prune(route.children)

      return children.length ? [{ ...route, children }] : []
    })

  return { ...config, routes: prune(collect(config.routes)) }
}
