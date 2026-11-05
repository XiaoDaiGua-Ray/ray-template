import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/examples/utilities',
  meta: {
    i18nKey: t('menu.DemoUtilities'),
    icon: 'navigation/database',
    order: 60,
  },
  children: [
    {
      path: '/axios',
      name: 'RAxios',
      component: routeView('demo/axios'),
      meta: {
        i18nKey: t('menu.Axios'),
        icon: 'logo/axios',
        keepAlive: true,
      },
    },
    {
      path: '/cache-demo',
      component: routeView('demo/cache-demo'),
      meta: {
        i18nKey: t('menu.CacheDemo'),
        icon: 'navigation/database',
      },
    },
    {
      path: '/precision',
      component: routeView('demo/precision'),
      meta: {
        i18nKey: t('menu.CalculatePrecision'),
        icon: 'navigation/other',
      },
    },
    {
      path: '/rely-about',
      component: routeView('demo/rely/views/rely-about'),
      meta: {
        i18nKey: t('menu.RelyAbout'),
        icon: 'navigation/rely',
      },
    },
  ],
} satisfies AppRouteRecordRaw
