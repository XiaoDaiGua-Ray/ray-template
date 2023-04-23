import type { AppRouteRecordRaw } from '@/router/type'

const office: AppRouteRecordRaw = {
  path: '/office',
  name: 'Office',
  component: () => import('@/views/office/index'),
  meta: {
    i18nKey: 'Office',
    icon: 'office',
    hidden: true,
  },
  children: [
    {
      path: '/document',
      name: 'Document',
      component: () => import('@/views/office/views/document/index'),
      meta: {
        i18nKey: 'Office_Document',
      },
    },
    {
      path: '/presentation',
      name: 'Presentation',
      component: () => import('@/views/office/views/presentation/index'),
      meta: {
        i18nKey: 'Office_Presentation',
      },
    },
    {
      path: '/spreadsheet',
      name: 'Spreadsheet',
      component: () => import('@/views/office/views/spreadsheet/index'),
      meta: {
        i18nKey: 'Office_Spreadsheet',
      },
    },
  ],
}

export default office
