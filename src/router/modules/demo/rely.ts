import { t } from '@/hooks/web/index'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const rely: AppRouteRecordRaw = {
  path: '/rely',
  name: 'RelyAbout',
  component: LAYOUT,
  meta: {
    i18nKey: t('menu.Rely'),
    icon: 'rely',
    order: 7,
  },
  children: [
    {
      path: 'rely-about',
      name: 'RelyAbout',
      component: () => import('@/views/demo/rely/views/rely-about/index'),
      meta: {
        i18nKey: 'RelyAbout',
      },
    },
  ],
}

export default rely
