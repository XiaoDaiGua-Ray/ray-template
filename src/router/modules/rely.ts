import type { AppRouteRecordRaw } from '@/router/type'

const rely: AppRouteRecordRaw = {
  path: '/rely',
  name: 'Rely',
  component: () => import('@/views/rely/index'),
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
