export default {
  path: '/error',
  name: 'error',
  component: () => import('@/views/error/index'),
  meta: {
    i18nKey: 'Error',
    icon: 'error',
  },
}
