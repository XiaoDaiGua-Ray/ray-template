import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/examples/navigation',
  meta: {
    i18nKey: t('menu.DemoNavigation'),
    icon: 'navigation/layout',
    order: 50,
  },
  children: [
    {
      path: '/layout-demo',
      name: 'LayoutDemo',
      component: routeView('demo/layout-demo'),
      meta: { i18nKey: t('menu.LayoutDemo'), icon: 'navigation/layout' },
    },
    {
      path: '/router-demo',
      component: LAYOUT,
      meta: {
        i18nKey: t('menu.RouterDemo'),
        icon: 'navigation/routing',
      },
      children: [
        {
          path: 'router-demo-home',
          component: routeView('demo/router-demo/router-demo-home'),
          meta: {
            noLocalTitle: '人员信息(平级模式)',
          },
        },
        {
          path: 'router-demo-detail',
          component: routeView('demo/router-demo/router-demo-detail'),
          meta: {
            noLocalTitle: '信息详情',
            sameLevel: true,
          },
        },
      ],
    },
    {
      path: '/multi',
      component: LAYOUT,
      meta: {
        i18nKey: t('menu.MultiMenu'),
        icon: 'navigation/menu',
        extra: {
          label: 'cache',
        },
      },
      children: [
        {
          path: 'multi-menu-one',
          name: 'MultiMenuOne',
          component: routeView('demo/multi/views/multi-menu-one'),
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
              component: routeView(
                'demo/multi/views/multi-menu-two/views/sub-menu-other',
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
                  component: routeView(
                    'demo/multi/views/multi-menu-two/views/sub-menu/views/multi-menu-two-one',
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
    },
  ],
} satisfies AppRouteRecordRaw
