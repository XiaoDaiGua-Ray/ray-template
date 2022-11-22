export default {
  path: '/rely',
  name: 'rely',
  component: () => import('@/views/rely/index'),
  meta: {
    i18nKey: 'Rely',
    icon: 'rely',
  },
  children: [
    {
      path: '/rely-about',
      name: 'rely-about',
      component: () => import('@/views/rely/views/rely-about/index'),
      meta: {
        i18nKey: 'RelyAbout',
      },
    },
  ],
}
