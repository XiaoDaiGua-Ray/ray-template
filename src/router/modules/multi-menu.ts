export default {
  path: '/multi-menu',
  name: 'multi-menu',
  component: () => import('@/views/multi-menu/index'),
  meta: {
    i18nKey: 'MultiMenu',
    icon: 'table',
  },
  children: [
    {
      path: 'multi-menu-one',
      name: 'multi-menu-one',
      component: () => import('@/views/multi-menu/views/multi-menu-one/index'),
      meta: {
        noLocalTitle: '多级菜单-1',
      },
    },
    {
      path: 'multi-menu-two',
      name: 'multi-menu-two',
      component: () => import('@/views/multi-menu/views/multi-menu-two/index'),
      meta: {
        noLocalTitle: '多级菜单-2',
      },
      children: [
        {
          path: 'sub-menu',
          name: 'sub-menu',
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
