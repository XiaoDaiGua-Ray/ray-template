import { useAppNavigation } from '../../src/hooks/template/useAppNavigation'

const { push, replace, menus } = vi.hoisted(() => ({
  push: vi.fn().mockResolvedValue(void 0),
  replace: vi.fn().mockResolvedValue(void 0),
  menus: [{ fullPath: '/parent', children: [{ fullPath: '/target' }] }],
}))

vi.mock('../../src/hooks', () => ({
  useVueRouter: () => ({
    router: { push, replace, getRoutes: () => [{ path: '/target' }] },
  }),
}))
vi.mock('../../src/store', () => ({
  useMenuGetters: () => ({ getMenuOptions: { value: menus } }),
}))

describe('useAppNavigation', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns the navigation promise and supports paths, menu objects and indices', async () => {
    const { navigationTo } = useAppNavigation()

    expect(navigationTo('/target')).toBeInstanceOf(Promise)
    await navigationTo(0)
    expect(push).toHaveBeenLastCalledWith({ path: '/target', query: void 0 })
    await navigationTo('/target', { isPush: false, query: { from: 'demo' } })
    expect(replace).toHaveBeenCalledWith({
      path: '/target',
      query: { from: 'demo' },
    })
  })

  it.each([-1, NaN, Infinity, 0.5, 1])('ignores invalid index %s', (index) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(() => useAppNavigation().navigationTo(index)).not.toThrow()
    expect(push).not.toHaveBeenCalled()
    expect(warning).toHaveBeenCalled()
    warning.mockRestore()
  })
})
