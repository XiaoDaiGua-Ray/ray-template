import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const multiMenu: AppRouteRecordRaw = {
  path: '/multi',
  name: 'MultiMenu',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.MultiMenu'),
    icon: 'other',
    order: 4,
  },
  children: [
    {
      path: 'multi-menu-one',
      name: 'MultiMenuOne',
      component: () => import('@/views/multi/views/multi-menu-one/index'),
      meta: {
        noLocalTitle: '多级菜单-1',
        keepAlive: true,
      },
    },
    {
      path: 'multi-menu-two',
      name: 'MultiMenuTwo',
      component: LAYOUT,
      meta: {
        noLocalTitle: '多级菜单-2',
      },
      children: [
        {
          path: 'sub-menu',
          name: 'SubMenu',
          component: () =>
            import('@/views/multi/views/multi-menu-two/views/sub-menu/index'),
          meta: {
            noLocalTitle: '多级菜单-2-1',
            keepAlive: true,
          },
          children: [
            {
              path: 'sub-menu-one',
              name: 'MultiMenuTwoOne',
              component: () =>
                import(
                  '@/views/multi/views/multi-menu-two/views/sub-menu/views/multi-menu-two-one/index'
                ),
              meta: {
                noLocalTitle: '多级菜单-2-1-1',
                keepAlive: true,
              },
            },
          ],
        },
      ],
    },
  ],
}

export default multiMenu
