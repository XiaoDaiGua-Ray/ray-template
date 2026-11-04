import './styles/entry'
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
import { expandRoutes } from '@/router/utils/expand-routes'
import { useSettingActions, useSettingGetters } from '@/store'
import { useMemoryCache } from '@/utils/cache-backend'
import { exampleFocusKey } from '@/views/demo/hooks/example-focus'
import type { IconPackage } from '@ray-template/icons'
import { iconSprites } from '@ray-template/icons/manifest'
import { provideUiServices } from '@ray-template/ui/services'
import { RouterView } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const examplePaths = new Set([
  '/dashboard',
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
const params = new URLSearchParams(location.search)
const withLayout = params.get('layout') === '1'
const examples = [
  ...getStaticAppRoutes().filter(({ path }) => examplePaths.has(path)),
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
    const { getAppTheme, getLocaleLanguage } = useSettingGetters()

    provideUiServices({
      dark: () => getAppTheme.value,
      locale: () => getLocaleLanguage.value,
      chartTheme: APP_THEME.echartTheme,
      translate: t,
      iconUrl: (name, prefix) =>
        `${iconSprites[name.split('/')[0] as IconPackage]}#${prefix}-${name}`,
      reportError: (message) => window.$message?.error(message),
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

  const routes = expandRoutes(examples) as unknown as RouteRecordRaw[]

  if (withLayout) {
    router.addRoute({ path: '/', component: Layout, children: routes })
  } else {
    for (const route of routes) router.addRoute(route)
  }

  router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/dashboard' })
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
