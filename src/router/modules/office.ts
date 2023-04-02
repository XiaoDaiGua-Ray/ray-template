export default {
  path: '/office',
  name: 'office',
  component: () => import('@/views/office/index'),
  meta: {
    i18nKey: 'Office',
    icon: 'office',
    hidden: true,
  },
  children: [
    {
      path: '/document',
      name: 'document',
      component: () => import('@/views/office/views/document/index'),
      meta: {
        i18nKey: 'Office_Document',
      },
    },
    {
      path: '/presentation',
      name: 'presentation',
      component: () => import('@/views/office/views/presentation/index'),
      meta: {
        i18nKey: 'Office_Presentation',
      },
    },
    {
      path: '/spreadsheet',
      name: 'spreadsheet',
      component: () => import('@/views/office/views/spreadsheet/index'),
      meta: {
        i18nKey: 'Office_Spreadsheet',
      },
    },
  ],
}
