import {
  appExpandRoutes,
  getAppRawRoutes,
  getStaticAppRoutes,
} from '@/router/app-route-modules'
import {
  exportRouteConfig,
  parseRouteConfig,
  toRuntimeRoutes,
} from '@/router/config/contract'
import { getRouteJsonSchema } from '@/router/config/json-schema'
import { expandRoutes } from '@/router/utils/expand-routes'
import { orderRoutes } from '@/router/utils/order-routes'
import { validRole } from '@/router/utils/valid-role'

const page = { component: 'dashboard', meta: {} }
const parse = (routes: unknown[]) =>
  parseRouteConfig(JSON.stringify({ version: 1, routes }))

describe('route configuration', () => {
  it('keeps both management pages under the same admin-only menu', () => {
    const root = getAppRawRoutes().find(
      ({ path }) => path === '/route-management',
    )
    const leaves = appExpandRoutes().filter(({ path }) =>
      path.startsWith('/route-management/'),
    )

    expect(root?.children?.map(({ path }) => path)).toEqual(['visual', 'json'])
    expect(leaves.map(({ path }) => path)).toEqual([
      '/route-management/visual',
      '/route-management/json',
    ])

    for (const { meta } of leaves) {
      expect(validRole(meta, 'admin')).toBe(true)
      expect(validRole(meta, 'viewer')).toBe(false)
    }
  })

  it('round-trips all bundled routes with their view IDs and metadata', () => {
    const bundled = getStaticAppRoutes()
    const config = exportRouteConfig(bundled)
    const restored = toRuntimeRoutes(parseRouteConfig(JSON.stringify(config)))

    expect(config.routes.length).toBeGreaterThan(10)
    expect(exportRouteConfig(restored)).toEqual(config)
    expect(expandRoutes(restored)).toEqual(expandRoutes(bundled))
  })

  it('exports a strict versioned schema with recursive menu definitions', () => {
    const schema = getRouteJsonSchema()

    expect(schema).toMatchObject({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      additionalProperties: false,
      properties: {
        version: { const: 1 },
        routes: { items: { $ref: '#/$defs/route' } },
      },
      $defs: {
        route: {
          additionalProperties: false,
          properties: {
            children: { items: { $ref: '#/$defs/route' } },
            meta: {
              additionalProperties: false,
              properties: { keepAlive: { type: 'boolean' } },
            },
          },
        },
      },
    })
  })

  it('uses absolute child paths and applies every ancestor role to direct access', () => {
    const config = parse([
      {
        path: '/private',
        meta: { role: ['admin', 'editor'] },
        children: [
          { ...page, path: '/absolute', meta: { role: ['editor'] } },
          { ...page, path: 'relative', alias: '/short' },
        ],
      },
    ])

    const [absolute, relative] = expandRoutes(toRuntimeRoutes(config))

    expect(absolute.path).toBe('/absolute')
    expect(relative.path).toBe('/private/relative')
    expect(relative.alias).toBe('/short')
    expect(validRole(absolute.meta, 'admin')).toBe(false)
    expect(validRole(absolute.meta, 'editor')).toBe(true)
    expect(validRole(relative.meta, 'viewer')).toBe(false)
  })

  it.each([
    [[{ ...page, path: '/route-management' }], /reserved/i],
    [[{ ...page, path: '/ROUTE-MANAGEMENT/Visual' }], /reserved/i],
    [
      [{ ...page, path: '/reports', alias: '/route-management/json' }],
      /reserved/i,
    ],
    [[{ ...page, path: '/reports', name: 'RLogin' }], /reserved/i],
    [[{ ...page, path: '/reports', component: 'missing' }], /unknown view/i],
    [
      [{ ...page, path: '/reports', meta: { icon: 'fake/icon' } }],
      /unknown icon/i,
    ],
    [
      [{ ...page, path: '/reports', meta: { keepAlive: true } }],
      /registered component name/i,
    ],
    [
      [{ ...page, path: '/dashboard', meta: { role: ['editor'] } }],
      /all authenticated roles/i,
    ],
    [
      [{ path: '/external', meta: { windowOpen: 'javascript:alert(1)' } }],
      /windowOpen/,
    ],
    [[{ ...page, path: '/reports', props: { innerHTML: '<img>' } }], /props/],
    [[{ ...page, path: '/reports', meta: { typo: true } }], /meta/],
    [
      [
        { ...page, path: '/a', alias: '/b' },
        { ...page, path: '/b' },
      ],
      /duplicate/i,
    ],
    [
      [
        { path: '/a', redirect: '/b', meta: {} },
        { path: '/b', redirect: '/a', meta: {} },
      ],
      /cycle/i,
    ],
    [
      [
        { ...page, path: '/:id', meta: { hidden: true } },
        { ...page, path: '/:item', meta: { hidden: true } },
      ],
      /conflicting/i,
    ],
  ])('rejects invalid routes %j', (routes, message) => {
    expect(() => parse(routes)).toThrow(message)
  })

  it('sorts missing order consistently and leaves the input in place', () => {
    const first = { path: '/first', name: 'A', meta: {} }
    const second = { path: '/second', name: 'B', meta: { order: 0 } }
    const input = [second, first]

    expect(orderRoutes(input)).toEqual([first, second])
    expect(input).toEqual([second, first])
  })
})
