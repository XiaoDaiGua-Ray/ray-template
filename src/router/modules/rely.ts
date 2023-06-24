import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

import { LAYOUT } from '@/router/constant/index'

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
      component: () => import('@/views/rely/views/rely-about/index'),
      meta: {
        i18nKey: 'RelyAbout',
      },
    },
  ],
}

export default rely
