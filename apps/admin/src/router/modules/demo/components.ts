import { t } from '@/hooks/web/useI18n'
import { routeView } from '@/router/config/views'
import type { AppRouteRecordRaw } from '@/router/types'

export default {
  path: '/examples/components',
  meta: {
    i18nKey: t('menu.DemoComponents'),
    icon: 'navigation/components',
    order: 20,
  },
  children: [
    {
      path: '/form',
      component: routeView('demo/form'),
      meta: {
        i18nKey: t('menu.Form'),
        icon: 'navigation/form',
        extra: {
          label: 'useForm',
        },
      },
    },
    {
      path: '/modal-demo',
      component: routeView('demo/modal-demo'),
      meta: {
        i18nKey: t('menu.Modal'),
        icon: 'navigation/window',
      },
    },
    {
      path: '/segment',
      component: routeView('demo/segment'),
      meta: {
        i18nKey: t('menu.Segment'),
        icon: 'navigation/components',
        extra: {
          label: 'segment',
        },
      },
    },
    {
      path: '/draggable-card',
      component: routeView('demo/draggable-card'),
      meta: {
        i18nKey: t('menu.DraggableCard'),
        icon: 'action/draggable',
        extra: {
          label: 'drag',
        },
      },
    },
    {
      path: '/echart',
      component: routeView('demo/echart'),
      meta: {
        i18nKey: t('menu.Echart'),
        icon: 'navigation/echart',
        extra: {
          label: 'useChart',
        },
      },
    },
    {
      path: '/flow',
      component: routeView('demo/flow-demo'),
      meta: {
        i18nKey: t('menu.Flow'),
        icon: 'navigation/flow',
      },
    },
    {
      path: '/iframe',
      component: routeView('demo/iframe'),
      meta: {
        icon: 'navigation/window',
        noLocalTitle: 'iframe',
      },
    },
  ],
} satisfies AppRouteRecordRaw
