import Breadcrumb from '@/layout/components/SiderBar/components/Breadcrumb'
import type { AppMenuOption } from '@/types'
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import type { Ref } from 'vue'

const state = vi.hoisted(() => ({
  compact: null as unknown as Ref<boolean>,
  icons: null as unknown as Ref<boolean>,
  fallback: null as unknown as Ref<boolean>,
  options: null as unknown as Ref<AppMenuOption[]>,
}))

vi.mock('@/hooks', () => ({
  useDevice: () => ({ isTabletOrSmaller: state.compact }),
}))

vi.mock('@/store', () => ({
  useMenuActions: () => ({ changeMenuModelValue: vi.fn() }),
  useMenuGetters: () => ({ getBreadcrumbOptions: state.options }),
  useSettingGetters: () => ({
    getBreadcrumbIcon: state.icons,
    getBreadcrumbIconFallback: state.fallback,
  }),
}))

const option = (path: string, label: string): AppMenuOption => ({
  name: label,
  path,
  key: path,
  fullPath: path,
  label,
  breadcrumbLabel: label,
  meta: {},
})

it('displays menu images and defaults to a fallback for the missing icon', async () => {
  state.compact = ref(false)
  state.icons = ref(true)
  state.fallback = ref(true)
  state.options = ref([
    {
      ...option('/reports', 'Reports'),
      icon: () => h('img', { src: '/report.png', alt: '' }),
    },
    option('/reports/monthly', 'Monthly'),
  ])
  const wrapper = mount(Breadcrumb)

  try {
    const iconSelector = '.layout-breadcrumb__icon'

    expect(wrapper.get(`${iconSelector} img`).attributes('src')).toBe(
      '/report.png',
    )
    expect(wrapper.findAll(iconSelector)).toHaveLength(2)
    state.fallback.value = false
    await nextTick()
    expect(wrapper.findAll(iconSelector)).toHaveLength(1)

    state.compact.value = true
    state.fallback.value = true
    await nextTick()
    expect(wrapper.get('[aria-current="page"]').text()).toBe('Monthly')
    expect(wrapper.findAll(iconSelector)).toHaveLength(1)

    state.icons.value = false
    await nextTick()
    expect(wrapper.findAll(iconSelector)).toHaveLength(0)
  } finally {
    wrapper.unmount()
  }
})
