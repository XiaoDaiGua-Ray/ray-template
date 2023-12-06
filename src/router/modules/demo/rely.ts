import { t } from '@/hooks/web'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const rely: AppRouteRecordRaw = {
  path: '/rely',
  name: 'Rely',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.Rely'),
    icon: 'rely',
    order: 999,
  },
  children: [
    {
      path: 'rely-about',
      name: 'RelyAbout',
      component: () => import('@/views/demo/rely/views/rely-about/index'),
      meta: {
        i18nKey: t('menu.RelyAbout'),
      },
    },
  ],
}

export default rely
