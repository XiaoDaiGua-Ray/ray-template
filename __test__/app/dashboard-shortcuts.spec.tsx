import { flushPromises, mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { AppMenuOption } from '../../apps/admin/src/types'
import Dashboard from '../../apps/admin/src/views/dashboard'

const menus = ref<AppMenuOption[]>([])

vi.mock('@/store', () => ({
  useMenuGetters: () => ({ getMenuOptions: menus }),
}))
vi.mock('@/hooks', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

const menu = (
  path: string,
  children?: AppMenuOption[],
  show = true,
): AppMenuOption => ({
  path,
  fullPath: path,
  key: path,
  name: path,
  label: path,
  meta: {},
  children,
  show,
})

const setupDashboard = async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['/dashboard', '/template-hooks', '/layout-demo', '/svg-icons'].map(
      (path) => ({
        path,
        component: { render: () => null },
      }),
    ),
  })

  await router.push('/dashboard')
  const wrapper = mount(Dashboard, { global: { plugins: [router] } })
  const links = () => wrapper.findAll('.r-dashboard-shortcut')

  return { router, wrapper, links }
}

it('shows declared destinations below visible menu groups and navigates to the chosen page', async () => {
  menus.value = [
    menu('/examples', [
      menu('/hooks', [menu('/template-hooks')]),
      menu('/layout-demo'),
      menu('/resources', [menu('/svg-icons')]),
    ]),
  ]
  const { router, wrapper, links } = await setupDashboard()

  try {
    expect(links().map((link) => link.attributes('href'))).toEqual([
      '/template-hooks',
      '/layout-demo',
      '/svg-icons',
    ])
    await links()[2].trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/svg-icons')
  } finally {
    wrapper.unmount()
  }
})

it('prunes hidden ancestors and hidden leaves instead of exposing their destinations', async () => {
  menus.value = [
    menu('/hidden-root', [menu('/template-hooks')], false),
    menu('/visible-root', [
      menu('/hidden-nested', [menu('/layout-demo')], false),
      menu('/svg-icons'),
    ]),
  ]
  const { wrapper, links } = await setupDashboard()

  try {
    expect(links().map((link) => link.attributes('href'))).toEqual([
      '/svg-icons',
    ])
    menus.value[1].children![1].show = false
    await nextTick()
    expect(links()).toHaveLength(0)
    expect(wrapper.find('.r-dashboard-shortcuts').exists()).toBe(false)
  } finally {
    wrapper.unmount()
  }
})

it('reacts to the current permitted tree without inventing a default or treating external entries as pages', async () => {
  menus.value = [menu('/template-hooks')]
  const { router, wrapper, links } = await setupDashboard()

  try {
    expect(links()).toHaveLength(1)
    menus.value = [menu('/unrelated')]
    await nextTick()
    expect(links()).toHaveLength(0)
    expect(router.currentRoute.value.path).toBe('/dashboard')

    menus.value = [
      { ...menu('/svg-icons'), meta: { windowOpen: 'https://example.com' } },
    ]
    await nextTick()
    expect(links()).toHaveLength(0)
  } finally {
    wrapper.unmount()
  }
})
