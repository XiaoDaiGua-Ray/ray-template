import { t } from '@/hooks/web/useI18n'
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
      component: () => import('@/views/demo/tables/basic'),
      meta: { i18nKey: t('menu.TableBasic') },
    },
    {
      path: 'remote',
      name: 'TableDemoRemote',
      component: () => import('@/views/demo/tables/remote'),
      meta: { i18nKey: t('menu.TableRemote') },
    },
    {
      path: 'auto-height',
      name: 'TableDemoAutoHeight',
      component: () => import('@/views/demo/tables/auto-height'),
      meta: { i18nKey: t('menu.TableAutoHeight') },
    },
    {
      path: 'columns',
      name: 'TableDemoColumns',
      component: () => import('@/views/demo/tables/columns'),
      meta: { i18nKey: t('menu.TableColumns') },
    },
    {
      path: 'printing',
      name: 'TableDemoPrinting',
      component: () => import('@/views/demo/tables/printing'),
      meta: { i18nKey: t('menu.TablePrinting') },
    },
    {
      path: 'custom',
      name: 'TableDemoCustom',
      component: () => import('@/views/demo/tables/custom'),
      meta: { i18nKey: t('menu.TableCustom') },
    },
  ],
}

export default tables
