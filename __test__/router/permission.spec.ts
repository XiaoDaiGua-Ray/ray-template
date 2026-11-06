import { createMemoryHistory, createRouter } from 'vue-router'
import { APP_CATCH_KEY } from '../../apps/admin/src/app-config'
import { permissionRouter } from '../../apps/admin/src/router/utils/permission'
import { resolveLandingPath } from '../../apps/admin/src/router/utils/resolve-landing-path'

vi.mock('../../apps/admin/src/router/utils/valid-role', () => ({
  validRole: (meta: { role?: string[] }) =>
    !meta.role?.length || meta.role.includes('admin'),
}))

const session: {
  signingCallback: { id?: string }
  revalidateSession: () => Promise<'active'>
} = {
  signingCallback: {},
  revalidateSession: async () => 'active',
}

function setupRouter(rootRole?: string[]) {
  const component = { render: () => null }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'RLogin', component },
      { path: '/welcome', name: 'RWelcome', component },
      { path: '/403', name: 'ErrorPage403', component },
      { path: '/404', name: 'ErrorPage404', component },
      { path: '/500', name: 'ErrorPage500', component },
      { path: '/dashboard', component, meta: { role: rootRole } },
      { path: '/allowed', component, meta: { role: ['admin'] } },
      {
        path: '/denied',
        alias: '/denied-alias',
        component,
        meta: { role: ['editor'] },
      },
      { path: '/legacy', redirect: '/allowed' },
      { path: '/alias-shortcut', redirect: '/denied-alias' },
      {
        path: '/private-shortcut',
        redirect: '/allowed',
        meta: { role: ['editor'] },
      },
      { path: '/via-private', redirect: '/private-shortcut' },
      {
        path: '/restricted-group',
        component,
        meta: { role: ['editor'] },
        children: [{ path: 'page', component, meta: { role: ['admin'] } }],
      },
      {
        path: '/docs',
        name: 'RayTemplateDoc',
        component,
        meta: { role: ['editor'] },
      },
    ],
  })

  permissionRouter(router, () => session)

  return router
}

describe('Router 5 permission guard', () => {
  beforeEach(() => {
    session.signingCallback = {}
    localStorage.clear()
    sessionStorage.clear()
  })

  it('redirects unauthenticated protected navigation to login', async () => {
    const router = setupRouter()

    localStorage.setItem(APP_CATCH_KEY.token, 'unverified-token')

    await router.push('/allowed')

    expect(router.currentRoute.value.path).toBe('/')
  })

  it('opens the neutral workspace after login without choosing a business home', async () => {
    session.signingCallback = { id: 'verified-test-user' }
    const router = setupRouter()

    await router.push('/')

    expect(router.currentRoute.value.path).toBe('/welcome')
  })

  it('allows permitted roles and authenticated whitelist routes', async () => {
    session.signingCallback = { id: 'verified-test-user' }
    const router = setupRouter()

    await router.push('/allowed')

    expect(router.currentRoute.value.path).toBe('/allowed')

    await router.push('/docs')

    expect(router.currentRoute.value.path).toBe('/docs')
  })

  it('shows forbidden state for a denied direct link', async () => {
    session.signingCallback = { id: 'verified-test-user' }
    const router = setupRouter()

    await router.push('/denied')

    expect(router.currentRoute.value.path).toBe('/403')
    expect(router.currentRoute.value.query.from).toBe('/denied')
  })

  it.each([
    '/alias-shortcut',
    '/private-shortcut',
    '/via-private',
    '/restricted-group/page',
  ])('blocks %s and keeps the attempted URL', async (path) => {
    session.signingCallback = { id: 'verified-test-user' }
    const router = setupRouter()
    const attempted = `${path}?filter=open#row`

    await router.push(attempted)

    expect(router.currentRoute.value.path).toBe('/403')
    expect(router.currentRoute.value.query.from).toBe(attempted)
  })

  it('retains a restricted redirect entry through sign-in for permission checking', async () => {
    const router = setupRouter()
    const attempted = '/via-private?source=link#report'

    await router.push(attempted)
    expect(router.currentRoute.value.query.redirect).toBe(attempted)
    session.signingCallback = { id: 'verified-test-user' }
    expect(
      resolveLandingPath(router, router.currentRoute.value.query.redirect),
    ).toBe('/welcome')
  })

  it('does not depend on the legacy dashboard being permitted', async () => {
    const router = setupRouter(['editor'])

    await router.push('/')
    session.signingCallback = { id: 'verified-test-user' }
    await router.push('/denied')

    expect(router.currentRoute.value.path).toBe('/403')
  })

  it('retains an authorized requested URL through login with query and hash intact', async () => {
    const router = setupRouter()

    await router.push('/allowed?filter=open#row-2')
    expect(router.currentRoute.value.query.redirect).toBe(
      '/allowed?filter=open#row-2',
    )
    session.signingCallback = { id: 'verified-test-user' }
    await router.replace(
      resolveLandingPath(router, router.currentRoute.value.query.redirect),
    )
    expect(router.currentRoute.value.fullPath).toBe(
      '/allowed?filter=open#row-2',
    )
  })

  it('preserves query and hash when an authenticated login URL supplies a valid redirect', async () => {
    session.signingCallback = { id: 'verified-test-user' }
    const router = setupRouter()

    await router.push({
      path: '/',
      query: { redirect: '/allowed?filter=open#row-2' },
    })
    expect(router.currentRoute.value.fullPath).toBe(
      '/allowed?filter=open#row-2',
    )
  })

  it.each([
    '/denied',
    '/missing',
    '//example.com',
    'https://example.com',
    '/500',
    '/\\example.com',
  ])(
    'does not restore unsafe, inaccessible or status target %s',
    async (redirect) => {
      session.signingCallback = { id: 'verified-test-user' }
      const router = setupRouter()

      await router.push({ path: '/', query: { redirect } })
      expect(router.currentRoute.value.path).toBe('/welcome')
    },
  )

  it('validates redirect destinations while preserving their original requested URL', () => {
    expect(resolveLandingPath(setupRouter(), '/legacy?filter=open#row')).toBe(
      '/legacy?filter=open#row',
    )
  })

  it('shows not found for an unknown authenticated route', async () => {
    session.signingCallback = { id: 'verified-test-user' }
    const router = setupRouter()

    await router.push('/missing?from=test')
    expect(router.currentRoute.value.path).toBe('/404')
    expect(router.currentRoute.value.query.from).toBe('/missing?from=test')
  })
})
