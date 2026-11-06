import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import { NResult } from 'naive-ui'
import { h, nextTick, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { AppMenuOption } from '../../apps/admin/src/types'
import PageResult from '../../apps/admin/src/views/error/PageResult'
import Welcome from '../../apps/admin/src/views/welcome'

const menus = ref<AppMenuOption[]>([])
const recentPaths = ref<string[]>([])
const locale = ref('en-US')
const messages: Record<
  string,
  Record<string, Record<string, string>>
> = Object.fromEntries(
  ['en-US', 'zh-CN'].map((language) => [
    language,
    JSON.parse(
      readFileSync(
        resolve(
          process.cwd(),
          `apps/admin/src/locales/lang/${language}/workspaceStates.json`,
        ),
        'utf8',
      ),
    ),
  ]),
)

vi.mock('@/store', () => ({
  useMenuGetters: () => ({ getMenuOptions: menus }),
  useNavigationHistoryGetters: () => ({ recentPaths }),
  piniaSigningStore: () => ({ signingCallback: { role: 'viewer' } }),
}))

vi.mock('@/hooks', () => ({
  useI18n: (namespace?: string) => ({
    t: (key: string) => {
      if (namespace !== 'workspaceStates') return key

      const [section, field] = key.split('.')

      return messages[locale.value][section]?.[field] ?? key
    },
  }),
}))

const menu = (
  path: string,
  extra: Partial<AppMenuOption> = {},
): AppMenuOption => ({
  path,
  fullPath: path,
  key: path,
  name: path,
  label: path,
  breadcrumbLabel: path,
  meta: {},
  ...extra,
})

const createPageRouter = async (path = '/welcome') => {
  const page = { render: () => null }
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/welcome', name: 'RWelcome', component: page },
      { path: '/403', name: 'ErrorPage403', component: page },
      { path: '/404', name: 'ErrorPage404', component: page },
      { path: '/500', name: 'ErrorPage500', component: page },
      { path: '/reports', name: 'Reports', component: page },
      { path: '/users', name: 'Users', component: page },
      {
        path: '/restricted',
        name: 'Restricted',
        component: page,
        meta: { role: ['admin'] },
      },
    ],
  })

  await router.push(path)

  return router
}

beforeEach(() => {
  menus.value = []
  recentPaths.value = []
  locale.value = 'en-US'
})

it('ranks current visible menu entries by recent visits without opening a page', async () => {
  menus.value = [
    menu('/group', { children: [menu('/reports'), menu('/users')] }),
    menu('/hidden', { show: false, children: [menu('/hidden/child')] }),
    menu('/restricted', { show: false }),
    menu('/external', { meta: { windowOpen: 'https://example.com' } }),
    menu('/details/:id'),
  ]
  recentPaths.value = ['/removed', '/restricted', '/users']
  const router = await createPageRouter()
  const wrapper = mount(Welcome, { global: { plugins: [router] } })

  try {
    expect(
      wrapper
        .findAll('.r-welcome__link')
        .map((link) => link.attributes('href')),
    ).toEqual(['/users', '/reports'])
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(router.currentRoute.value.path).toBe('/welcome')
    expect(wrapper.text()).not.toContain('/removed')

    menus.value = [menu('/reports')]
    await nextTick()
    expect(
      wrapper
        .findAll('.r-welcome__link')
        .map((link) => link.attributes('href')),
    ).toEqual(['/reports'])
  } finally {
    wrapper.unmount()
  }
})

it('shows an honest no-access state and updates its language', async () => {
  const router = await createPageRouter()
  const wrapper = mount(Welcome, { global: { plugins: [router] } })

  try {
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.text()).toContain(messages['en-US'].welcome.noPagesTitle)
    locale.value = 'zh-CN'
    await nextTick()
    expect(wrapper.text()).toContain(messages['zh-CN'].welcome.noPagesTitle)
    expect(wrapper.get('h1').text()).toBe(messages['zh-CN'].welcome.title)
  } finally {
    wrapper.unmount()
  }
})

it.each([
  ['403', 'forbidden'],
  ['404', 'notFound'],
  ['500', 'serverError'],
] as const)(
  'renders %s with its own identity and neutral recovery action',
  async (status, key) => {
    const router = await createPageRouter(`/${status}`)
    const wrapper = mount(PageResult, {
      props: { status },
      global: { plugins: [router] },
    })

    try {
      expect(wrapper.getComponent(NResult).props('status')).toBe(status)
      expect(wrapper.get('h1').text()).toBe(messages['en-US'][key].title)
      expect(wrapper.get('.error-page__mark').text()).toBe(status)
      await wrapper.get('button').trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toBe('/welcome')
    } finally {
      wrapper.unmount()
    }
  },
)

it('retries an authorized failed route with its query and hash intact', async () => {
  const router = await createPageRouter(
    '/500?from=%2Freports%3Fperiod%3Dweek%23chart',
  )
  const wrapper = mount(PageResult, {
    props: { status: '500' },
    global: { plugins: [router] },
  })

  try {
    const retry = wrapper
      .findAll('button')
      .find((button) => button.text() === messages['en-US'].actions.retry)!

    await retry.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe(
      '/reports?period=week#chart',
    )
  } finally {
    wrapper.unmount()
  }
})

it.each(['//example.com', '/500', '/restricted'])(
  'omits retry for unsafe/unavailable target %s',
  async (from) => {
    const router = await createPageRouter(
      `/500?from=${encodeURIComponent(from)}`,
    )
    const wrapper = mount(PageResult, {
      props: { status: '500' },
      global: { plugins: [router] },
    })

    try {
      expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
        messages['en-US'].actions.workspace,
      ])
    } finally {
      wrapper.unmount()
    }
  },
)

it('preserves custom title, description, content and footer configuration', async () => {
  const router = await createPageRouter('/404')
  const wrapper = mount(PageResult, {
    props: {
      status: '404',
      title: 'Custom title',
      description: 'Custom explanation',
    },
    slots: {
      default: () => h('p', 'Details'),
      footer: () => h('button', 'Custom recovery'),
    },
    global: { plugins: [router] },
  })

  try {
    expect(wrapper.get('h1').text()).toBe('Custom title')
    expect(wrapper.text()).toContain('Custom explanation')
    expect(wrapper.text()).toContain('Details')
    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      'Custom recovery',
    ])
  } finally {
    wrapper.unmount()
  }
})
