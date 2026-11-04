import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

const tables: AppRouteRecordRaw = {
  path: '/tables',
  meta: {
    i18nKey: t('menu.Table'),
    icon: 'navigation/table',
    order: 2,
  },
  children: [
    {
      path: 'basic',
      name: 'TableDemoBasic',
      component: routeView('demo/tables/basic'),
      meta: { i18nKey: t('menu.TableBasic') },
    },
    {
      path: 'remote',
      name: 'TableDemoRemote',
      component: routeView('demo/tables/remote'),
      meta: { i18nKey: t('menu.TableRemote') },
    },
    {
      path: 'auto-height',
      name: 'TableDemoAutoHeight',
      component: routeView('demo/tables/auto-height'),
      meta: { i18nKey: t('menu.TableAutoHeight') },
    },
    {
      path: 'columns',
      name: 'TableDemoColumns',
      component: routeView('demo/tables/columns'),
      meta: { i18nKey: t('menu.TableColumns') },
    },
    {
      path: 'printing',
      name: 'TableDemoPrinting',
      component: routeView('demo/tables/printing'),
      meta: { i18nKey: t('menu.TablePrinting') },
    },
    {
      path: 'custom',
      name: 'TableDemoCustom',
      component: routeView('demo/tables/custom'),
      meta: { i18nKey: t('menu.TableCustom') },
    },
    {
      path: 'hooks-query',
      name: 'TableDemoHooksQuery',
      component: routeView('demo/tables/hooks-query'),
      meta: { i18nKey: t('menu.TableHooksQuery') },
    },
    {
      path: 'hooks-selection',
      name: 'TableDemoHooksSelection',
      component: routeView('demo/tables/hooks-selection'),
      meta: { i18nKey: t('menu.TableHooksSelection') },
    },
    {
      path: 'hooks-output',
      name: 'TableDemoHooksOutput',
      component: routeView('demo/tables/hooks-output'),
      meta: { i18nKey: t('menu.TableHooksOutput') },
    },
  ],
}

export default tables
