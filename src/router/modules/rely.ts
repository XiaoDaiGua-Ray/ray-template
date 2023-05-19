import type { AppRouteRecordRaw } from '@/router/type'

import { LAYOUT } from '@/router/constant/index'

const rely: AppRouteRecordRaw = {
  path: '/rely',
  name: 'Rely',
  component: LAYOUT,
  meta: {
    i18nKey: 'Rely',
    icon: 'rely',
  },
  children: [
    {
      path: '/rely-about',
      name: 'RelyAbout',
      component: () => import('@/views/rely/views/rely-about/index'),
      meta: {
        i18nKey: 'RelyAbout',
      },
    },
  ],
}

export default rely
