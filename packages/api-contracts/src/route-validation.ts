import { getDotPath, safeParse } from 'valibot'
import { routeConfigSchema } from './routes.ts'
import type { RouteConfig, RouteConfigRecord } from './routes.ts'

export interface RouteValidationCatalog {
  managementPath: string
  reservedPaths?: readonly string[]
  reservedNames?: readonly string[]
  findRouteView(id: string): { name: string } | undefined
  isIconName(value: string): boolean
  normalizeIcon(value: string): string
}

const joinRoutePath = (parent: string, path: string) =>
  path.startsWith('/') ? path : `${parent.replace(/\/$/, '')}/${path}`

export function createRouteParser(catalog: RouteValidationCatalog) {
  const reservedPaths =
    catalog.reservedPaths?.map((path) => path.toLowerCase()) ?? []
  const isReservedPath = (path: string) =>
    path === '/' ||
    path === catalog.managementPath ||
    path.startsWith(`${catalog.managementPath}/`) ||
    reservedPaths.some(
      (reserved) => path === reserved || path.startsWith(`${reserved}/`),
    )
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

    const visit = (records: RouteConfigRecord[], parent = '') => {
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

        if (meta.icon) meta.icon = catalog.normalizeIcon(meta.icon)

        if (meta.extra?.icon)
          meta.extra.icon = catalog.normalizeIcon(meta.extra.icon)

        for (const icon of [meta.icon, meta.extra?.icon]) {
          if (icon && !catalog.isIconName(icon)) fail(`Unknown icon "${icon}".`)
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

          visit(children, path)
          continue
        }

        const view = component && catalog.findRouteView(component)

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

  return parseRouteConfig
}
