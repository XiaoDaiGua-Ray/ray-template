import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/types'

const multiMenu: AppRouteRecordRaw = {
  path: '/multi',
  name: 'MultiMenu',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.MultiMenu'),
    icon: 'other',
    order: 4,
    extra: {
      label: 'cache',
    },
  },
  children: [
    {
      path: 'multi-menu-one',
      name: 'MultiMenuOne',
      component: () => import('@/views/demo/multi/views/multi-menu-one/index'),
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
          path: 'sub-menu-other',
          name: 'SubMenuOther',
          component: () =>
            import(
              '@/views/demo/multi/views/multi-menu-two/views/sub-menu-other/index'
            ),
          meta: {
            noLocalTitle: '多级菜单-2-1',
            keepAlive: true,
          },
        },
        {
          path: 'sub-menu',
          name: 'SubMenu',
          component: LAYOUT,
          meta: {
            noLocalTitle: '多级菜单-2-2',
            keepAlive: true,
          },
          children: [
            {
              path: 'sub-menu-one',
              name: 'MultiMenuTwoOne',
              component: () =>
                import(
                  '@/views/demo/multi/views/multi-menu-two/views/sub-menu/views/multi-menu-two-one/index'
                ),
              meta: {
                noLocalTitle: '多级菜单-2-2-1',
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
