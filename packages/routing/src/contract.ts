import { isIconName } from '@ray-template/icons'
import { getDotPath, safeParse } from 'valibot'
import { joinRoutePath } from './join-route-path'
import { routeConfigSchema } from './schema'
import type { RouteConfig, RouteConfigRecord } from './schema'
import type { AppRouteRecordRaw } from './types'

export interface RouteCatalog {
  layout: AppRouteRecordRaw['component']
  findRouteView(
    id: string,
  ):
    | { name: string; load: NonNullable<AppRouteRecordRaw['component']> }
    | undefined
  findRouteViewId(loader: unknown): string | undefined
  homePath: string
  managementPath: string
  reservedNames?: readonly string[]
}

export function createRouteContract(catalog: RouteCatalog) {
  const {
    layout: LAYOUT,
    findRouteView,
    findRouteViewId,
    managementPath: ROUTE_MANAGEMENT_PATH,
    homePath: DEFAULT_HOME_PATH,
  } = catalog
  const isReservedPath = (path: string) =>
    path === '/' ||
    path === ROUTE_MANAGEMENT_PATH ||
    path.startsWith(`${ROUTE_MANAGEMENT_PATH}/`)
  const reservedNames = new Set(
    catalog.reservedNames?.map((name) => name.toLowerCase()),
  )
  const configLimit = 256 * 1024
  const asList = (value: string | string[] | undefined) =>
    typeof value === 'string' ? [value] : (value ?? [])

  function parseRouteConfig(text: string): RouteConfig {
    if (text.length > configLimit)
      throw new Error('Route configuration exceeds 256 KiB.')

    const input = JSON.parse(text)
    let count = 0
    const checkDepth = (routes: unknown, depth: number) => {
      if (!Array.isArray(routes)) return

      count += routes.length

      if (count > 300 || depth > 8)
        throw new Error('Use at most 300 routes and 8 menu levels.')

      for (const item of routes) checkDepth(item?.children, depth + 1)
    }

    checkDepth(input?.routes, 1)

    const result = safeParse(routeConfigSchema, input)

    if (!result.success) {
      throw new Error(
        result.issues
          .slice(0, 20)
          .map((issue) => `${getDotPath(issue) ?? 'config'}: ${issue.message}`)
          .join('\n'),
      )
    }

    const config = result.output

    const paths = new Map<string, RouteConfigRecord>()
    const names = new Set(reservedNames)
    const menuPaths = new Set<string>()
    const matchPatterns = new Set<string>()

    const visit = (
      records: RouteConfigRecord[],
      parent = '',
      restricted = false,
    ) => {
      for (const record of records) {
        const { name, component, children, alias, redirect, props, meta } =
          record
        const path = joinRoutePath(parent, record.path)
        const fail = (message: string): never => {
          throw new Error(`${path}: ${message}`)
        }

        const menuPath = path.toLowerCase()

        if (menuPaths.has(menuPath) || isReservedPath(menuPath))
          fail('Duplicate or reserved menu path.')

        menuPaths.add(menuPath)

        if (meta.windowOpen && !URL.canParse(meta.windowOpen))
          fail('Invalid external URL.')

        if (name) {
          const key = name.toLowerCase()

          if (names.has(key)) fail(`Duplicate or reserved name "${name}".`)

          names.add(key)
        }

        for (const icon of [meta.icon, meta.extra?.icon]) {
          if (icon && !isIconName(icon)) fail(`Unknown icon "${icon}".`)
        }

        if (children?.length) {
          if (
            (component && component !== 'layout') ||
            alias ||
            redirect ||
            props !== void 0 ||
            meta.windowOpen
          )
            fail('Groups accept layout, children and menu metadata.')

          if (path.includes(':')) fail('Use static paths for menu groups.')

          visit(children, path, restricted || !!meta.role?.length)
          continue
        }

        const view = component && findRouteView(component)

        if (component && !view) fail(`Unknown view "${component}".`)

        if (
          Number(!!component) +
            Number(!!redirect) +
            Number(!!meta.windowOpen) !==
          1
        )
          fail('Specify exactly one view, redirect or external URL.')

        if (props !== void 0 && !view) fail('Props require a view.')

        if (meta.keepAlive && (!view || name !== view.name))
          fail('keepAlive requires the registered component name.')

        if (path.includes(':') && !meta.hidden && !meta.sameLevel)
          fail('Parameterized paths must be hidden or sameLevel.')

        for (const address of [path, ...asList(alias)]) {
          const key = address.toLowerCase()

          if (
            key
              .split('/')
              .some((segment) => segment === '.' || segment === '..')
          )
            fail(`Invalid path "${address}".`)

          if (isReservedPath(key) || paths.has(key))
            fail(`Duplicate or reserved path "${address}".`)

          if (
            key === DEFAULT_HOME_PATH &&
            (address !== path ||
              path !== DEFAULT_HOME_PATH ||
              !view ||
              restricted ||
              meta.role?.length)
          )
            fail(
              '/dashboard must be a view accessible to all authenticated roles.',
            )

          if (address !== path && (address.includes(':') || path.includes(':')))
            fail('Aliases require a static page path.')

          const pattern = key.replace(/:[a-z_]\w*/g, ':param')

          if (matchPatterns.has(pattern))
            fail(`Conflicting parameter pattern "${address}".`)

          matchPatterns.add(pattern)
          paths.set(key, record)
        }
      }
    }

    visit(config.routes)

    for (const [path, record] of paths) {
      let current = record
      const visited = new Set<RouteConfigRecord>()

      while (current.redirect) {
        const next = paths.get(current.redirect.toLowerCase())

        if (
          visited.has(current) ||
          !next ||
          next.meta.windowOpen ||
          current.redirect.includes(':')
        ) {
          throw new Error(
            `${path}: Redirects must reach a configured page without a cycle.`,
          )
        }

        visited.add(current)
        current = next
      }
    }

    return config
  }

  function toRuntimeRoutes(config: RouteConfig): AppRouteRecordRaw[] {
    const toRoute = ({
      component,
      children,
      meta,
      ...record
    }: RouteConfigRecord): AppRouteRecordRaw =>
      ({
        ...record,
        meta: meta as AppRouteRecordRaw['meta'],
        component:
          component === 'layout'
            ? LAYOUT
            : component
              ? findRouteView(component)?.load
              : void 0,
        children: children?.map(toRoute),
      }) as AppRouteRecordRaw

    return config.routes.map(toRoute)
  }

  function exportRouteConfig(routes: AppRouteRecordRaw[]): RouteConfig {
    const toRecord = ({
      path,
      name,
      meta,
      component,
      children,
      props,
      alias,
      redirect,
    }: AppRouteRecordRaw): RouteConfigRecord => {
      const id = component === LAYOUT ? 'layout' : findRouteViewId(component)

      if (component && !id)
        throw new Error(
          `${path}: Register the view in router/config/views.ts before exporting.`,
        )

      if (redirect && typeof redirect !== 'string')
        throw new Error(`${path}: Export requires a string redirect.`)

      return {
        path,
        name,
        meta: meta as RouteConfigRecord['meta'],
        component: id,
        alias,
        redirect,
        props,
        children: children?.map(toRecord),
      }
    }

    return parseRouteConfig(
      JSON.stringify({ version: 1, routes: routes.map(toRecord) }),
    )
  }

  return { parseRouteConfig, toRuntimeRoutes, exportRouteConfig }
}
