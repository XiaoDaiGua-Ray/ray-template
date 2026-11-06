import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { Router } from 'vue-router'
import RouteTransition from '../../packages/admin-shell/src/RouteTransition.vue'

let wrapper: VueWrapper | undefined
let router: Router
let host: HTMLDivElement
let mounts: { one: number; two: number }

beforeEach(() => {
  vi.useFakeTimers()
  mounts = { one: 0, two: 0 }
  host = document.createElement('div')
  document.body.append(host)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    setTimeout(() => callback(performance.now()), 16),
  )
  const getComputedStyle = window.getComputedStyle.bind(window)

  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const style = getComputedStyle(element)

    if (!element.matches('.page-enter-active, .page-leave-active')) return style

    return new Proxy(style, {
      get(target, key, receiver) {
        if (key === 'transitionDuration') return '0.3s'

        if (key === 'transitionDelay') return '0s'

        if (key === 'transitionProperty') return 'opacity'

        if (key === 'animationDuration' || key === 'animationDelay') return '0s'

        return Reflect.get(target, key, receiver)
      },
    })
  })
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = void 0
  router?.options.history.destroy()
  host.remove()
  vi.clearAllTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const navigate = async (path: string) => {
  await router.push(path)
  await nextTick()
}

const mountRoutes = async (cache: boolean) => {
  const page = (name: 'one' | 'two') =>
    defineComponent({
      name: name === 'one' ? 'PageOne' : 'PageTwo',
      setup() {
        const instance = ++mounts[name]

        return () => h('div', { 'data-page': name }, `${name}-${instance}`)
      },
    })

  router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/one', component: page('one') },
      { path: '/two', component: page('two') },
    ],
  })
  await router.push('/one')
  await router.isReady()
  wrapper = mount(RouteTransition, {
    attachTo: host,
    props: {
      transitionPropName: 'page',
      transitionMode: 'out-in',
      transitionAppear: false,
      getKeepAliveConfig: {
        setupKeepAlive: cache,
        maxKeepAliveLength: 10,
        keepAliveExclude: [],
      },
      getKeepAliveInclude: ['PageOne', 'PageTwo'],
    },
    global: { plugins: [router], stubs: { transition: false } },
  })
  await nextTick()
}

it.each([true, false])(
  'waits for the outgoing page before displaying its successor (cache=%s)',
  async (cache) => {
    await mountRoutes(cache)
    expect(host.querySelector('[data-page="one"]')?.textContent).toBe('one-1')

    await navigate('/two')
    await vi.advanceTimersByTimeAsync(64)

    expect(host.querySelector('[data-page="one"]')).not.toBeNull()
    expect(host.querySelector('[data-page="two"]')).toBeNull()
    await vi.advanceTimersByTimeAsync(650)
    expect(host.querySelector('[data-page="one"]')).toBeNull()
    expect(host.querySelector('[data-page="two"]')?.textContent).toBe('two-1')

    await navigate('/one')
    await vi.advanceTimersByTimeAsync(714)
    expect(host.querySelector('[data-page="one"]')?.textContent).toBe(
      cache ? 'one-1' : 'one-2',
    )
    expect(mounts.one).toBe(cache ? 1 : 2)
  },
)

it('keeps distinct fullPath cache entries while reusing the same page component', async () => {
  await mountRoutes(true)
  await navigate('/one?view=other')
  await vi.advanceTimersByTimeAsync(714)
  expect(host.querySelector('[data-page="one"]')?.textContent).toBe('one-2')
  await navigate('/one')
  await vi.advanceTimersByTimeAsync(714)
  expect(host.querySelector('[data-page="one"]')?.textContent).toBe('one-1')
  expect(mounts.one).toBe(2)
})
