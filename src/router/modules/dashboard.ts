export default {
  path: '/dashboard',
  name: 'dashboard',
  component: () => import('@/views/dashboard/index'),
  meta: {
    i18nKey: 'Dashboard',
    icon: 'dashboard',
  },
}
