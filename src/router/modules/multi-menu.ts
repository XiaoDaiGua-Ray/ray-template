import type { AppRouteRecordRaw } from '@/router/type'

import { LAYOUT } from '@/router/constant/index'

const multiMenu: AppRouteRecordRaw = {
  path: '/multi',
  name: 'MultiMenu',
  component: LAYOUT,
  meta: {
    i18nKey: 'MultiMenu',
    icon: 'table',
  },
  children: [
    {
      path: 'multi-menu-one',
      name: 'MultiMenuOne',
      component: () => import('@/views/multi/views/multi-menu-one/index'),
      meta: {
        noLocalTitle: '多级菜单-1',
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
          },
        },
      ],
    },
  ],
}

export default multiMenu
