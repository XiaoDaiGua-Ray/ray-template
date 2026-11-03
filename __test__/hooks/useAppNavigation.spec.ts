import { createMemoryHistory, createRouter } from 'vue-router'
import { useAppNavigation } from '../../src/hooks/template/useAppNavigation'
import type { AppMenuOption } from '../../src/types'

const { state, menus } = vi.hoisted(() => ({
  state: { router: void 0 as ReturnType<typeof createRouter> | undefined },
  menus: [{ fullPath: '/parent', children: [{ fullPath: '/target' }] }],
}))

vi.mock('../../src/hooks/template/useVueRouter', () => ({
  useVueRouter: () => ({ router: state.router }),
}))
vi.mock('../../src/store', () => ({
  useMenuGetters: () => ({ getMenuOptions: { value: menus } }),
}))

describe('useAppNavigation', () => {
  beforeEach(() => {
    state.router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/target', component: {} },
        { path: '/items/:id', component: {} },
        { path: '/:catchAll(.*)', component: {} },
      ],
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it('returns the navigation promise and supports indices and menu objects', async () => {
    const { navigationTo } = useAppNavigation()

    const pending = navigationTo(0)

    expect(pending).toBeInstanceOf(Promise)
    await pending
    expect(state.router?.currentRoute.value.path).toBe('/target')
    await navigationTo({ fullPath: '/items/4' } as AppMenuOption)
    expect(state.router?.currentRoute.value.path).toBe('/items/4')
  })

  it('resolves a dynamic path and preserves URL query and hash when replacing', async () => {
    const replace = vi.spyOn(state.router!, 'replace')

    await useAppNavigation().navigationTo('/items/8?source=url&keep=1#header', {
      isPush: false,
      query: { source: 'option' },
    })

    expect(replace).toHaveBeenCalledOnce()
    expect(state.router?.currentRoute.value).toMatchObject({
      path: '/items/8',
      params: { id: '8' },
      query: { source: 'option', keep: '1' },
      hash: '#header',
    })
  })

  it.each([-1, NaN, Infinity, 0.5, 1, '/unknown'])(
    'ignores invalid target %s',
    (target) => {
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const push = vi.spyOn(state.router!, 'push')

      expect(useAppNavigation().navigationTo(target)).toBeUndefined()
      expect(push).not.toHaveBeenCalled()
      expect(warning).toHaveBeenCalledOnce()
    },
  )
})
