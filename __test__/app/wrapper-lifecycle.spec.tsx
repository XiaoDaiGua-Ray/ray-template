import { mount } from '@vue/test-utils'
import { NAvatar, NButton, NSpin } from 'naive-ui'
import { nextTick } from 'vue'
import AppAvatar from '../../apps/admin/src/app-components/app/AppAvatar'
import AppGlobalSpin from '../../apps/admin/src/app-components/app/AppGlobalSpin'
import UnlockScreen from '../../apps/admin/src/app-components/app/AppLockScreen/components/UnlockScreen'

vi.mock('@/store', async () => {
  const { ref } = await import('vue')

  return {
    useSigningGetters: () => ({
      getSigningCallback: ref({ name: 'Tester', avatar: '' }),
    }),
    useRuntimeGetters: () => ({ globalSpinning: ref(true) }),
    useSettingActions: () => ({ updateSettingState: vi.fn() }),
    useSettingGetters: () => ({ getLocaleLanguage: ref('en-US') }),
    useSigningActions: () => ({ logout: vi.fn() }),
    useLockScreenActions: () => ({ setLocked: vi.fn() }),
    useLockScreenGetters: () => ({ getLocked: ref(true) }),
  }
})

vi.mock('@/hooks', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  useDevice: () => ({ isTabletOrSmaller: false }),
}))

it('honors avatar shape, native size, and keyboard focus', () => {
  const wrapper = mount(AppAvatar, {
    props: { round: false, size: 42, objectFit: 'contain' },
  })

  try {
    expect(wrapper.findComponent(NAvatar).props()).toMatchObject({
      round: false,
      size: 42,
      objectFit: 'contain',
    })
    expect(wrapper.findComponent(NButton).props('focusable')).toBe(true)
  } finally {
    wrapper.unmount()
  }
})

it('merges global spin overrides while preserving its owned busy state', () => {
  const wrapper = mount(AppGlobalSpin, {
    props: { show: false, themeOverrides: { opacitySpinning: '0.7' } },
  })

  try {
    expect(wrapper.findComponent(NSpin).props()).toMatchObject({
      show: true,
      themeOverrides: { opacitySpinning: '0.7' },
    })
  } finally {
    wrapper.unmount()
  }
})

it('updates the lock-screen date at midnight and cancels its minute timer', async () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-11-06T23:59:59'))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
  const wrapper = mount(UnlockScreen, {
    global: {
      stubs: {
        AppAvatar: true,
        RForm: { template: '<div><slot /></div>' },
        NFormItem: { template: '<div><slot /></div>' },
        NInput: true,
        NButton: true,
        NFlex: { template: '<div><slot /></div>' },
      },
    },
  })

  try {
    expect(wrapper.text()).toContain('2026-11-06')
    await vi.advanceTimersByTimeAsync(1_000)
    await nextTick()
    expect(wrapper.text()).toContain('2026-11-07')
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    wrapper.unmount()
    vi.restoreAllMocks()
    vi.useRealTimers()
  }
})
