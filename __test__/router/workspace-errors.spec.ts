import { setupRouterErrors } from '@/router/utils/setup-router-errors'
import { flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

it('routes a failed page import to 500 with its original recovery target', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/welcome', component: { render: () => null } },
      { path: '/500', component: { render: () => null } },
      {
        path: '/reports',
        component: () => Promise.reject(new Error('chunk unavailable')),
      },
    ],
  })

  setupRouterErrors(router)

  try {
    await router.push('/welcome')
    await expect(router.push('/reports?range=week#chart')).rejects.toThrow(
      'chunk unavailable',
    )
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/500')
    expect(router.currentRoute.value.query.from).toBe(
      '/reports?range=week#chart',
    )
  } finally {
    router.options.history.destroy()
    consoleError.mockRestore()
  }
})

it('does not retry recursively when the 500 page itself cannot load', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  const loader = vi.fn(() => Promise.reject(new Error('status unavailable')))
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/welcome', component: { render: () => null } },
      { path: '/500', component: loader },
    ],
  })

  setupRouterErrors(router)

  try {
    await router.push('/welcome')
    await expect(router.push('/500')).rejects.toThrow('status unavailable')
    await flushPromises()
    expect(loader).toHaveBeenCalledOnce()
    expect(router.currentRoute.value.path).toBe('/welcome')
  } finally {
    router.options.history.destroy()
    consoleError.mockRestore()
  }
})

it.each(['succeeded', 'pending', 'duplicated'] as const)(
  'ignores an older failed import when a newer navigation is %s',
  async (newer) => {
    const stale = Promise.withResolvers<{ render: () => null }>()
    const next = Promise.withResolvers<{ render: () => null }>()
    const component = { render: () => null }
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/welcome', component },
        { path: '/500', component },
        { path: '/slow', component: () => stale.promise },
        {
          path: '/ready',
          component: newer === 'pending' ? () => next.promise : component,
        },
      ],
    })

    setupRouterErrors(router)

    try {
      await router.push('/welcome')
      const oldNavigation = router
        .push('/slow')
        .catch((error: unknown) => error)

      await flushPromises()
      const newNavigation = router.push(
        newer === 'duplicated' ? '/welcome' : '/ready',
      )

      await flushPromises()
      stale.reject(new Error('obsolete chunk'))
      await oldNavigation
      await flushPromises()
      expect(router.currentRoute.value.path).toBe(
        newer === 'succeeded' ? '/ready' : '/welcome',
      )
      next.resolve(component)
      await newNavigation
      expect(router.currentRoute.value.path).toBe(
        newer === 'duplicated' ? '/welcome' : '/ready',
      )
    } finally {
      router.options.history.destroy()
    }
  },
)
