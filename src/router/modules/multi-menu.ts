import type { AppRouteRecordRaw } from '@/router/type'

const multiMenu: AppRouteRecordRaw = {
  path: '/multi-menu',
  name: 'MultiMenu',
  component: () => import('@/views/multi-menu/index'),
  meta: {
    i18nKey: 'MultiMenu',
    icon: 'table',
  },
  children: [
    {
      path: 'multi-menu-one',
      name: 'MultiMenuOne',
      component: () => import('@/views/multi-menu/views/multi-menu-one/index'),
      meta: {
        noLocalTitle: '多级菜单-1',
      },
    },
    {
      path: 'multi-menu-two',
      name: 'MultiMenuTwo',
      component: () => import('@/views/multi-menu/views/multi-menu-two/index'),
      meta: {
        noLocalTitle: '多级菜单-2',
      },
      children: [
        {
          path: 'sub-menu',
          name: 'SubMenu',
          component: () =>
            import(
              '@/views/multi-menu/views/multi-menu-two/views/sub-menu/index'
            ),
          meta: {
            noLocalTitle: '多级菜单-2-1',
          },
        },
      ],
    },
  ],
}

export default multiMenu
