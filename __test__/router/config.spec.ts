import {
  appExpandRoutes,
  getAppRawRoutes,
  getStaticAppRoutes,
  setAppRouteModules,
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
import { piniaMenuStore } from '@/store/modules/menu'
import { piniaSigningStore } from '@/store/modules/signing'
import { createRouteParser } from '@ray-template/api-contracts/route-validation'
import { nextTick } from 'vue'
import setupMiniApp from '../utils/setupMiniApp'

const page = { component: 'dashboard', meta: {} }

it('accepts nested icon names for both menu and badge after catalog validation', () => {
  const icon = 'business/orders/approved'
  const isIconName = vi.fn((name: string) => name === icon)
  const parser = createRouteParser({
    managementPath: '/route-management',
    findRouteView: () => ({ name: 'Dashboard' }),
    normalizeIcon: (name) => name,
    isIconName,
  })
  const config = {
    version: 1,
    routes: [{ ...page, path: '/reports', meta: { icon, extra: { icon } } }],
  }

  expect(parser(JSON.stringify(config)).routes[0].meta).toEqual(
    config.routes[0].meta,
  )
  expect(isIconName).toHaveBeenCalledWith(icon)
})
const parse = (routes: unknown[]) =>
  parseRouteConfig(JSON.stringify({ version: 1, routes }))

describe('route configuration', () => {
  it('requires the editor grant for the management menu and both direct links', () => {
    const root = getAppRawRoutes().find(
      ({ path }) => path === '/route-management',
    )
    const leaves = appExpandRoutes().filter(({ path }) =>
      path.startsWith('/route-management/'),
    )

    expect(root?.children?.map(({ path }) => path)).toEqual(['visual', 'json'])
    expect(root?.meta.requiredPermission).toBe('routes:write')
    expect(leaves.map(({ path }) => path)).toEqual([
      '/route-management/visual',
      '/route-management/json',
    ])

    for (const { meta } of leaves)
      expect(meta.requiredPermission).toBe('routes:write')
  })

  it('round-trips all bundled routes with their view IDs and metadata', () => {
    const bundled = getStaticAppRoutes()
    const config = exportRouteConfig(bundled)
    const restored = toRuntimeRoutes(parseRouteConfig(JSON.stringify(config)))

    expect(expandRoutes(bundled).length).toBeGreaterThan(10)
    expect(exportRouteConfig(restored)).toEqual(config)
    expect(expandRoutes(restored)).toEqual(expandRoutes(bundled))
  })

  it('preserves demo page URLs when grouping the menus', () => {
    const routes = getStaticAppRoutes()
    const leaves = expandRoutes(routes).map(({ path }) => path)

    expect(leaves).toEqual(
      expect.arrayContaining([
        '/form',
        '/svg-icons',
        '/barcode',
        '/template-hooks',
        '/router-demo/router-demo-home',
        '/multi/multi-menu-two/sub-menu/sub-menu-one',
        '/rely-about',
        '/tables/basic',
        '/tables/controlled',
        '/tables/hooks-output',
      ]),
    )
    expect(
      routes.find(({ path }) => path === '/tables')?.meta.extra?.label,
    ).toBe('TablePro')
  })

  it('migrates retired icon paths in both menu and external link metadata', () => {
    const config = parse([
      {
        ...page,
        path: '/reports',
        meta: {
          icon: 'action/export_excel',
          extra: { icon: 'logo/office' },
        },
      },
    ])

    expect(config.routes[0].meta).toMatchObject({
      icon: 'action/download',
      extra: { icon: 'navigation/table' },
    })
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
    [[{ ...page, path: '/welcome' }], /reserved/i],
    [[{ ...page, path: '/reports', alias: '/403' }], /reserved/i],
    [[{ ...page, path: '/reports', name: 'ErrorPage500' }], /reserved/i],
    [[{ ...page, path: '/404' }], /reserved/i],
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

  it('allows restricted dashboard pages and does not inject one into custom sources', () => {
    expect(
      parse([{ ...page, path: '/dashboard', meta: { role: ['editor'] } }])
        .routes,
    ).toHaveLength(1)

    try {
      setAppRouteModules(
        toRuntimeRoutes(parse([{ ...page, path: '/reports' }])),
      )
      expect(appExpandRoutes().some(({ path }) => path === '/dashboard')).toBe(
        false,
      )
      expect(appExpandRoutes().some(({ path }) => path === '/reports')).toBe(
        true,
      )
    } finally {
      setAppRouteModules(getStaticAppRoutes())
    }
  })

  it('sorts missing order consistently and leaves the input in place', () => {
    const first = { path: '/first', name: 'A', meta: {} }
    const second = { path: '/second', name: 'B', meta: { order: 0 } }
    const input = [second, first]

    expect(orderRoutes(input)).toEqual([first, second])
    expect(input).toEqual([second, first])
  })
})

it('rebuilds the menu when the next account finishes loading its routes', async () => {
  const { app } = await setupMiniApp()
  const signing = app.runWithContext(() => piniaSigningStore())
  const menu = app.runWithContext(() => piniaMenuStore())

  try {
    signing.signingCallback = { id: 'first', name: 'First', role: 'admin' }
    setAppRouteModules(getStaticAppRoutes())
    await nextTick()
    expect(menu.options.length).toBeGreaterThan(1)

    signing.clearSigningCallback()
    await nextTick()
    signing.signingCallback = { id: 'second', name: 'Second', role: 'member' }
    await nextTick()
    expect(menu.options).toHaveLength(0)
    setAppRouteModules(toRuntimeRoutes(parse([{ ...page, path: '/returned' }])))
    await nextTick()
    expect(menu.options.map(({ fullPath }) => fullPath)).toEqual(['/returned'])
  } finally {
    app.unmount()
    setAppRouteModules(getStaticAppRoutes())
  }
})

it('localizes saved built-in literal menu titles and preserves edited titles', () => {
  for (const [title, key] of [
    ['信息详情', 'menu.RouterPersonDetail'],
    ['已有定制标题', void 0],
  ]) {
    const config = parse([
      {
        ...page,
        path: '/router-demo/router-demo-detail',
        meta: { noLocalTitle: title },
      },
    ])

    expect(toRuntimeRoutes(config)[0].meta.i18nKey).toBe(key)
    expect(config.routes[0].meta.i18nKey).toBeUndefined()
  }
})
