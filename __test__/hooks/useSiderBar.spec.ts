import { APP_CATCH_KEY } from '@/app-config'
import { useAppRoot } from '@/hooks/template/useAppRoot'
import { useSiderBar } from '@/hooks/template/useSiderBar'
import { setupI18n } from '@/locales'
import { permissionRouter } from '@/router/utils/permission'
import { piniaKeepAliveStore } from '@/store/modules/keep-alive'
import { piniaMenuStore } from '@/store/modules/menu'
import { piniaSettingStore } from '@/store/modules/setting'
import { piniaSigningStore } from '@/store/modules/signing'
import { setStorage } from '@/utils/cache'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Router } from 'vue-router'

const state = vi.hoisted(() => ({
  router: null as unknown,
  routes: [] as unknown[],
}))

vi.mock('../../apps/admin/src/hooks/template/useVueRouter', () => ({
  useVueRouter: () => ({ router: state.router }),
}))
vi.mock('../../apps/admin/src/router/app-route-modules', () => ({
  getAppRawRoutes: () => state.routes,
  appExpandRoutes: () => state.routes,
}))

let pinia: ReturnType<typeof createPinia>
let router: Router
let wrapper: VueWrapper
let menu: ReturnType<typeof piniaMenuStore>
let actions: ReturnType<typeof useSiderBar>

beforeEach(async () => {
  localStorage.clear()
  sessionStorage.clear()
  const component = { render: () => h('div') }
  const business = [
    { path: '/reports', name: 'Reports', component, meta: { keepAlive: true } },
    { path: '/orders', name: 'Orders', component, meta: {} },
    {
      path: '/private',
      name: 'Private',
      component,
      meta: { role: ['admin'], keepAlive: true },
    },
  ]

  state.routes = business
  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'RLogin', component },
      {
        path: '/welcome',
        name: 'RWelcome',
        component,
        meta: { i18nKey: 'workspaceStates.welcome.title' },
      },
      {
        path: '/403',
        name: 'ErrorPage403',
        component,
        meta: { i18nKey: 'workspaceStates.forbidden.title' },
      },
      { path: '/404', name: 'ErrorPage404', component },
      { path: '/500', name: 'ErrorPage500', component },
      { path: '/:catchAll(.*)', name: 'RNotFound', redirect: '/404' },
      ...business,
    ],
  })
  state.router = router
  pinia = createPinia()
  setActivePinia(pinia)
  piniaSigningStore().signingCallback = {
    id: 'one',
    name: 'Tester',
    role: 'admin',
  }
  setStorage(APP_CATCH_KEY.token, 'token', 'localStorage')
  setStorage(APP_CATCH_KEY.appMenuTagOptions, [{ fullPath: '/dashboard' }])
  setStorage(APP_CATCH_KEY.appMenuKey, '/dashboard')
  permissionRouter(router)
  await router.push('/welcome')
  wrapper = mount(
    defineComponent({
      setup() {
        menu = piniaMenuStore()
        actions = useSiderBar()

        return () => h('div')
      },
    }),
    { global: { plugins: [pinia, router] } },
  )
  await flushPromises()
})

afterEach(() => {
  wrapper.unmount()
  disposePinia(pinia)
  router.options.history.destroy()
})

it('starts with no active business page and never injects a missing cached dashboard', () => {
  expect(menu.menuTagOptions).toEqual([])
  expect(menu.menuKey).toBeNull()
  expect(menu.currentMenuOption).toBeNull()
  expect(menu.breadcrumbOptions).toEqual([])
  expect(router.currentRoute.value.path).toBe('/welcome')
  expect(menu.options.map(({ fullPath }) => fullPath)).toEqual([
    '/reports',
    '/orders',
    '/private',
  ])
})

it('closes the final business tab, even when it is the legacy root preference', async () => {
  useAppRoot().setRootRoute({ path: '/reports', name: 'Reports' })
  await router.push('/reports?sort=asc#summary')
  await flushPromises()
  expect(actions.getCurrentTagIndex()).toBe(0)
  expect(piniaKeepAliveStore().keepAliveInclude).toEqual(['Reports'])
  await actions.close(0)
  await flushPromises()
  expect(menu.menuTagOptions).toEqual([])
  expect(menu.menuKey).toBeNull()
  expect(menu.currentMenuOption).toBeNull()
  expect(piniaKeepAliveStore().keepAliveInclude).toEqual([])
  expect(router.currentRoute.value.path).toBe('/welcome')
})

it('stores one tag per pathname and restores its latest query and hash', async () => {
  await router.push('/reports?sort=asc#first')
  await router.push('/reports?sort=desc#summary')
  await router.push('/orders')
  await flushPromises()
  expect(menu.menuTagOptions.map(({ fullPath }) => fullPath)).toEqual([
    '/reports?sort=desc#summary',
    '/orders',
  ])
  await actions.close('/orders')
  await flushPromises()
  expect(router.currentRoute.value.fullPath).toBe('/reports?sort=desc#summary')
  expect(menu.menuKey).toBe('/reports')
  expect(actions.getCurrentTagIndex()).toBe(0)
})

it('closes left, right and other tabs without protecting any business path', async () => {
  for (const path of ['/reports', '/orders', '/private'])
    await router.push(path)

  await flushPromises()
  expect(actions.checkCloseLeft('/orders')).toBe(true)
  expect(actions.checkCloseRight('/orders')).toBe(true)
  await actions.closeRight('/orders')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/orders')
  expect(menu.menuTagOptions.map(({ fullPath }) => fullPath)).toEqual([
    '/reports',
    '/orders',
  ])
  await actions.closeLeft('/orders')
  await router.push('/reports')
  await actions.closeOther('/orders')
  await flushPromises()
  expect(menu.menuTagOptions.map(({ fullPath }) => fullPath)).toEqual([
    '/orders',
  ])
  expect(router.currentRoute.value.path).toBe('/orders')
})

it('closes all tags independently of missing or unauthorized root preferences', async () => {
  await router.push('/reports')
  await router.push('/orders')
  useAppRoot().setRootRoute({ path: '/deleted-home' })
  await actions.closeAll()
  await flushPromises()
  expect(menu.menuTagOptions).toEqual([])
  expect(router.currentRoute.value.path).toBe('/welcome')
})

it('keeps status routes out of tabs and clears active business navigation', async () => {
  await router.push('/reports')

  for (const path of ['/welcome', '/403', '/404', '/500']) {
    await router.push(path)
    await flushPromises()
    expect(menu.currentMenuOption).toBeNull()
    expect(menu.menuKey).toBeNull()
    expect(menu.breadcrumbOptions).toEqual([])
    expect(menu.menuTagOptions.map(({ fullPath }) => fullPath)).toEqual([
      '/reports',
    ])
  }
})

it('removes shortcuts that lead through or to a route the current role cannot open', async () => {
  const shortcuts = [
    { path: '/private-link', redirect: '/private', meta: {} },
    {
      path: '/admin-link',
      redirect: '/reports',
      meta: { role: ['admin'] },
    },
    { path: '/via-admin', redirect: '/admin-link', meta: {} },
    { path: '/open-link', redirect: '/reports', meta: {} },
  ]

  for (const shortcut of shortcuts) router.addRoute(shortcut)

  state.routes = [...state.routes, ...shortcuts]
  await menu.setupAppMenu()
  expect(menu.options.map(({ fullPath }) => fullPath)).toContain('/via-admin')

  piniaSigningStore().signingCallback.role = 'member'
  await flushPromises()
  expect(menu.options.map(({ fullPath }) => fullPath)).toEqual([
    '/reports',
    '/orders',
    '/open-link',
  ])
})

it('closes the 403 view back to an allowed tab without storing a denied tab', async () => {
  piniaSigningStore().signingCallback.role = 'member'
  await router.push('/reports?sort=desc#summary')
  await router.push('/private')
  await flushPromises()

  expect(router.currentRoute.value.path).toBe('/403')
  expect(actions.getCurrentTagIndex()).toBe(-1)
  await actions.closeForbiddenPage()
  await flushPromises()

  expect(router.currentRoute.value.fullPath).toBe('/reports?sort=desc#summary')
  expect(menu.menuTagOptions.map(({ fullPath }) => fullPath)).toEqual([
    '/reports?sort=desc#summary',
  ])
})

it('closes a directly opened 403 to the workspace with no business tags', async () => {
  await router.push('/403')
  await actions.closeForbiddenPage()
  await flushPromises()

  expect(router.currentRoute.value.path).toBe('/welcome')
  expect(menu.menuTagOptions).toEqual([])
})

it('removes revoked tags and cached views without choosing another active page', async () => {
  await router.push('/reports')
  await router.push('/private?mode=edit#section')
  piniaSigningStore().signingCallback.role = 'member'
  await flushPromises()
  expect(menu.menuTagOptions.map(({ fullPath }) => fullPath)).toEqual([
    '/reports',
  ])
  expect(piniaKeepAliveStore().keepAliveInclude).toEqual(['Reports'])
  expect(menu.currentMenuOption).toBeNull()
  expect(router.currentRoute.value.path).toBe('/403')
  expect(router.currentRoute.value.query.from).toBe(
    '/private?mode=edit#section',
  )
})

it('clears account-owned tabs without recreating the still-visible page during logout', async () => {
  await router.push('/reports')
  piniaSigningStore().signingCallback = {} as never
  await flushPromises()
  expect(menu.menuTagOptions).toEqual([])
  expect(menu.currentMenuOption).toBeNull()
  expect(piniaKeepAliveStore().keepAliveInclude).toEqual([])
})

it('updates neutral and status document titles when the language changes', async () => {
  await setupI18n(wrapper.vm.$.appContext.app)
  const settings = piniaSettingStore()

  settings.updateLocale('zh-CN')
  await router.push('/403')
  await flushPromises()
  expect(document.title).toContain('暂时无法访问此页面')
  settings.updateLocale('en-US')
  await flushPromises()
  expect(document.title).toContain('This page is not available to you')
  await router.push('/welcome')
  await flushPromises()
  expect(document.title).toContain('Ready for your next task')
  settings.updateLocale('zh-CN')
  await flushPromises()
  expect(document.title).toContain('工作区已就绪')
})
