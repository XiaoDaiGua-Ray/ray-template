import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const office: AppRouteRecordRaw = {
  path: '/office',
  name: 'ROffice',
  component: () => import('@/views/demo/office/index'),
  meta: {
    i18nKey: t('menu.Office'),
    icon: 'office',
    hidden: true,
  },
  children: [
    {
      path: 'document',
      name: 'Document',
      component: () => import('@/views/demo/office/views/document/index'),
      meta: {
        i18nKey: 'Office_Document',
      },
    },
    {
      path: 'presentation',
      name: 'Presentation',
      component: () => import('@/views/demo/office/views/presentation/index'),
      meta: {
        i18nKey: 'Office_Presentation',
      },
    },
    {
      path: 'spreadsheet',
      name: 'Spreadsheet',
      component: () => import('@/views/demo/office/views/spreadsheet/index'),
      meta: {
        i18nKey: 'Office_Spreadsheet',
      },
    },
  ],
}

export default office
