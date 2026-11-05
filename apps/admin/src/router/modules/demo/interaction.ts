import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/examples/interaction',
  meta: { i18nKey: t('menu.DemoInteraction'), icon: 'action/mouse', order: 40 },
  children: [
    {
      path: '/template-hooks',
      name: 'TemplateHooks',
      component: routeView('demo/template-hooks'),
      meta: {
        i18nKey: t('menu.TemplateHooks'),
        icon: 'navigation/components',
      },
    },
    {
      path: '/web-hooks',
      name: 'WebHooks',
      component: routeView('demo/hooks/web-hooks'),
      meta: { i18nKey: t('menu.WebHooks'), icon: 'action/mouse' },
    },
    {
      path: '/directive',
      component: routeView('demo/directive'),
      meta: {
        i18nKey: t('menu.Directive'),
        icon: 'action/adjustment',
        extra: {
          label: 'ellipsis',
        },
      },
    },
    {
      path: '/context-menu',
      component: routeView('demo/context-menu'),
      meta: {
        i18nKey: t('menu.ContextMenu'),
        icon: 'action/more',
      },
    },
    {
      path: '/scroll-reveal',
      component: routeView('demo/scroll-reveal'),
      meta: {
        i18nKey: t('menu.scrollReveal'),
        icon: 'directional/expanded',
        hidden: true,
      },
    },
  ],
} satisfies AppRouteRecordRaw
