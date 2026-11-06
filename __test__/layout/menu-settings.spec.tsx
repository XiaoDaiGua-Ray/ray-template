import CustomMenu from '@/layout/components/SiderBar/components/SettingDrawer/segment-views/CustomMenu'
import { piniaSettingStore } from '@/store/modules/setting'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import type { AppMenuOption } from '@/types'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { NButton } from 'naive-ui'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { nextTick, ref } from 'vue'
import type { Ref } from 'vue'

const state = vi.hoisted(() => ({
  collapsed: null as unknown as Ref<boolean>,
  smaller: null as unknown as Ref<boolean>,
  options: null as unknown as Ref<AppMenuOption[]>,
  menuKey: null as unknown as Ref<string>,
  refresh: vi.fn(),
  collapse: vi.fn(),
  scroll: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: vi.fn() }),
  useDayjs: () => ({ locale: vi.fn() }),
  useDevice: () => ({ isTabletOrSmaller: state.smaller }),
  useSiderScroll: () => state.scroll,
}))

vi.mock('@/store', async () => {
  const settings = await import('@/store/hooks/useSettingStore')

  return {
    ...settings,
    useMenuGetters: () => ({
      getCollapsed: state.collapsed,
      getMenuOptions: state.options,
      getMenuKey: state.menuKey,
    }),
    useMenuActions: () => ({
      setupAppMenu: state.refresh,
      collapsedMenu: state.collapse,
    }),
  }
})

let wrapper: VueWrapper
let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  vi.clearAllMocks()
  state.collapsed = ref(false)
  state.smaller = ref(false)
  state.options = ref([])
  state.menuKey = ref('/reports')
  state.refresh.mockResolvedValue(void 0)
  vi.stubGlobal('$message', { success: state.success, error: state.error })
  pinia = createPinia()
  setActivePinia(pinia)
  wrapper = mount(CustomMenu)
})

afterEach(() => {
  wrapper.unmount()
  disposePinia(pinia)
  vi.unstubAllGlobals()
})

const button = (label: string) =>
  wrapper.findAllComponents(NButton).find((item) => item.text() === label)!

it('applies size presets without replacing menu behavior or layout preferences', async () => {
  const settings = piniaSettingStore()

  settings.updateSettingState('menuConfig', { accordion: true, inverted: true })
  settings.updateSettingState('layoutConfig', { mode: 'right' })
  await button('menu.compact').trigger('click')

  expect(settings.menuConfig).toMatchObject({
    menuWidth: 224,
    collapsedWidth: 56,
    iconSize: 18,
    accordion: true,
    inverted: true,
  })
  expect(settings.layoutConfig.mode).toBe('right')
  expect(button('menu.compact').attributes('aria-pressed')).toBe('true')
  settings.updateSettingState('menuConfig', { iconSize: 24 })
  await nextTick()
  expect(button('menu.compact').attributes('aria-pressed')).toBe('false')
})

it('enables sidebar actions only when the active desktop layout has a sidebar', async () => {
  const settings = piniaSettingStore()

  await button('menu.collapse').trigger('click')
  expect(state.collapse).toHaveBeenCalledExactlyOnceWith(true)
  settings.updateSettingState('layoutConfig', { mode: 'top' })
  await nextTick()
  expect(button('menu.collapse').props('disabled')).toBe(true)
  expect(button('menu.scrollTop').props('disabled')).toBe(true)
  settings.updateSettingState('layoutConfig', { mode: 'mixed' })
  await nextTick()
  expect(button('menu.collapse').props('disabled')).toBe(true)
  state.options.value = [
    {
      fullPath: '/reports',
      path: '/reports',
      name: 'Reports',
      label: 'Reports',
      key: '/reports',
      meta: {},
      show: true,
      children: [
        {
          fullPath: '/reports/daily',
          path: '/reports/daily',
          name: 'Daily',
          label: 'Daily',
          key: '/reports/daily',
          meta: {},
          show: true,
        },
      ],
    },
  ]
  await nextTick()
  expect(button('menu.collapse').props('disabled')).toBe(false)
  await button('menu.scrollTop').trigger('click')
  expect(state.scroll).toHaveBeenCalledExactlyOnceWith({
    top: 0,
    left: 0,
    behavior: 'auto',
  })
  state.smaller.value = true
  await nextTick()
  expect(button('menu.collapse').props('disabled')).toBe(true)
})

it('keeps collapse-mode changes local and resets only menu preferences', async () => {
  const settings = piniaSettingStore()

  settings.updateSettingState('contentTransition', 'none')
  settings.updateSettingState('layoutConfig', { mode: 'right' })
  await wrapper.get('input[value="transform"]').setValue()
  expect(settings.menuConfig.collapsedMode).toBe('transform')
  settings.updateSettingState('menuConfig', { accordion: true, menuWidth: 300 })
  await button('menu.reset').trigger('click')
  await flushPromises()
  expect(settings.menuConfig).toEqual(getDefaultSettingConfig().menuConfig)
  expect(settings.contentTransition).toBe('none')
  expect(settings.layoutConfig.mode).toBe('right')
  expect(state.refresh).toHaveBeenCalledOnce()
})

it('shows refresh progress and recovers from a failed refresh', async () => {
  let rejectRefresh!: (error: Error) => void

  state.refresh.mockImplementationOnce(
    () =>
      new Promise<void>((_, reject) => {
        rejectRefresh = reject
      }),
  )
  await button('menu.refresh').trigger('click')
  expect(button('menu.refresh').props('loading')).toBe(true)
  expect(button('menu.reset').props('disabled')).toBe(true)
  rejectRefresh(new Error('Menu unavailable'))
  await flushPromises()
  expect(state.error).toHaveBeenCalledExactlyOnceWith('menu.refreshFailed')
  expect(button('menu.refresh').props('loading')).toBe(false)
  expect(button('menu.reset').props('disabled')).toBe(false)
  await button('menu.refresh').trigger('click')
  await flushPromises()
  expect(state.success).toHaveBeenCalledExactlyOnceWith('menu.refreshed')
})
