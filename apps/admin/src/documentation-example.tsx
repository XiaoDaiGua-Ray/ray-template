import './styles/entry'
import { apiMockEnabled } from '@/api/admin/client'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider'
import AppWatermarkProvider from '@/app-components/provider/AppWatermarkProvider'
import { APP_THEME } from '@/app-config'
import { setupDayjs } from '@/dayjs'
import { setupDirectives } from '@/directives'
import { useI18n, useTheme } from '@/hooks'
import Layout from '@/layout'
import { setupI18n } from '@/locales'
import { router } from '@/router'
import {
  getStaticAppRoutes,
  setAppRouteModules,
} from '@/router/app-route-modules'
import { getSystemRoutes } from '@/router/routes'
import type { AppRouteRecordRaw } from '@/router/types'
import { expandRoutes } from '@/router/utils/expand-routes'
import { joinRoutePath } from '@/router/utils/join-route-path'
import { useSettingActions, useSettingGetters } from '@/store'
import { useMemoryCache } from '@/utils/cache-backend'
import { exampleFocusKey } from '@/views/demo/hooks/example-focus'
import type { IconPackage } from '@ray-template/icons'
import { iconSprites } from '@ray-template/icons/manifest'
import { provideUiServices } from '@ray-template/ui/services'
import { createStorage } from '@ray-template/utils/storage'
import { RouterView } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const examplePaths = new Set([
  '/dashboard',
  '/tables',
  '/form',
  '/modal-demo',
  '/echart',
  '/flow',
  '/segment',
  '/iframe',
  '/draggable-card',
  '/svg-icons',
  '/directive',
  '/template-hooks',
  '/web-hooks',
  '/multi',
  '/precision',
  '/cache-demo',
  '/axios',
  '/qrcode',
])

function selectExampleRoutes(
  routes: AppRouteRecordRaw[],
  parentPath = '',
): AppRouteRecordRaw[] {
  return routes.flatMap((route) => {
    const path = joinRoutePath(parentPath, route.path)

    if (examplePaths.has(path)) return [route]

    const children = selectExampleRoutes(route.children ?? [], path)

    return children.length ? [{ ...route, children }] : []
  })
}

const params = new URLSearchParams(location.search)
const withLayout = params.get('layout') === '1'
const examples = [
  ...selectExampleRoutes(getStaticAppRoutes()),
  {
    path: '/docs-core-utils',
    name: 'DocsCoreUtils',
    component: () => import('@/views/demo/docs-core-utils'),
    meta: { i18nKey: 'menu.DocsCoreUtils', order: 8 },
  },
  {
    path: '/docs-browser-utils',
    name: 'DocsBrowserUtils',
    component: () => import('@/views/demo/docs-browser-utils'),
    meta: { i18nKey: 'menu.DocsBrowserUtils', order: 9 },
  },
  {
    path: '/docs-storage-utils',
    name: 'DocsStorageUtils',
    component: () => import('@/views/demo/docs-storage-utils'),
    meta: { i18nKey: 'menu.DocsStorageUtils', order: 10 },
  },
]

const DocumentationExample = defineComponent({
  name: 'DocumentationExample',
  setup() {
    const { t } = useI18n()
    const { getAppTheme, getLocaleLanguage, getThemeStyle } =
      useSettingGetters()

    provideUiServices({
      dark: () => getAppTheme.value,
      locale: () => getLocaleLanguage.value,
      chartTheme: () => APP_THEME.echartTheme ?? `ray-${getThemeStyle.value}`,
      translate: t,
      iconUrl: (name, prefix) =>
        `${iconSprites[name.split('/')[0] as IconPackage]}#${prefix}-${name}`,
      columnStorage: createStorage(window.sessionStorage, 'ray-doc-examples'),
      reportError: (message) => window.$message?.error(message),
      reportSuccess: (message) => window.$message?.success(message),
    })

    return () => (
      <AppNaiveGlobalProvider>
        <AppStyleProvider />
        <AppWatermarkProvider />
        <RouterView />
      </AppNaiveGlobalProvider>
    )
  },
})

async function mountExample() {
  useMemoryCache()

  if (apiMockEnabled) {
    const { enableApiMock } = await import('./mocks/browser')

    await enableApiMock()
  }

  const app = createApp(DocumentationExample)

  app.use(createPinia())
  await setupI18n(app)
  setupDayjs()
  setupDirectives(app)

  const { updateLocale } = app.runWithContext(useSettingActions)
  const { darkTheme, lightTheme } = app.runWithContext(useTheme)

  updateLocale(params.get('lang') === 'en' ? 'en-US' : 'zh-CN')

  if (params.get('theme') === 'dark') darkTheme()
  else lightTheme()

  router.removeRoute('RLogin')
  router.removeRoute('RLayout')
  setAppRouteModules(examples)

  const routes = [
    ...expandRoutes(examples),
    ...getSystemRoutes(),
  ] as unknown as RouteRecordRaw[]

  if (withLayout) {
    router.addRoute({ path: '/', component: Layout, children: routes })
  } else {
    for (const route of routes) router.addRoute(route)
  }

  app.use(router)
  await router.isReady()

  const focus = params.get('focus')

  if (focus) {
    app.provide(exampleFocusKey, {
      path: router.currentRoute.value.path,
      names: new Set(focus.split(',')),
    })
  }

  app.mount('#app')
}

void mountExample()
