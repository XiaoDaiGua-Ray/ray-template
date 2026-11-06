/* eslint-disable vue/one-component-per-file */
import { APP_CATCH_KEY } from '@/app-config'
import Common from '@/layout/components/SiderBar/components/SettingDrawer/segment-views/Common'
import { piniaKeepAliveStore } from '@/store/modules/keep-alive'
import { piniaNavigationHistoryStore } from '@/store/modules/navigation-history'
import { piniaRuntimeStore } from '@/store/modules/runtime'
import { piniaSettingStore } from '@/store/modules/setting'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import { piniaSigningStore } from '@/store/modules/signing'
import { mount, shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { NButton, NSelect } from 'naive-ui'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { defineComponent, h, KeepAlive, nextTick, onUnmounted, ref } from 'vue'

const state = vi.hoisted(() => ({
  createModal: vi.fn(),
  scrollTo: vi.fn(),
}))

vi.mock('naive-ui', async (original) => ({
  ...(await original<typeof import('naive-ui')>()),
  useModal: () => ({ create: state.createModal }),
}))
vi.mock('@/hooks', async (original) => {
  const actual = await original<typeof import('@/hooks')>()

  return {
    ...actual,
    useI18n: (namespace?: string) => ({
      ...actual.useI18n(namespace),
      t: (key: string) => key,
    }),
    useContentScroll: () => state.scrollTo,
  }
})
let pinia: ReturnType<typeof createPinia>
let wrapper: VueWrapper

const button = (text: string) => {
  const target = wrapper
    .findAllComponents(NButton)
    .find((item) => item.text() === text)

  expect(target).toBeDefined()

  return target!
}
const invoke = (handler: unknown, ...args: unknown[]) => {
  expect(typeof handler).toBe('function')
  Reflect.apply(handler as (...args: unknown[]) => unknown, void 0, args)
}
const confirmAction = () => {
  const options = state.createModal.mock.calls.at(-1)?.[0] as {
    onPositiveClick: () => void
  }

  options.onPositiveClick()
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  piniaSigningStore().signingCallback = {
    id: 'settings-user',
    name: 'Settings user',
    role: 'admin',
  }
  wrapper = shallowMount(Common, {
    global: { plugins: [pinia], renderStubDefaultSlot: true },
  })
})

afterEach(() => {
  wrapper.unmount()
  disposePinia(pinia)
  vi.useRealTimers()
})

it('persists language and resets only title/cache preferences, keeping unrelated settings', async () => {
  const settings = piniaSettingStore()
  const language = wrapper.findAllComponents(NSelect)[0]

  invoke(language.props('onUpdateValue'), 'en-US')
  await nextTick()
  expect(settings.localeLanguage).toBe('en-US')
  expect(localStorage.getItem(APP_CATCH_KEY.localeLanguage)).toContain('en-US')
  settings.updateSettingState('dynamicDocumentTitle', false)
  settings.updateSettingState('keepAliveConfig', {
    maxKeepAliveLength: 3,
    setupKeepAlive: false,
    keepAliveExclude: ['Reports'],
  })
  settings.updateSettingState('watermarkSwitch', true)
  invoke(button('general.reset').props('onClick'))
  await nextTick()

  expect(settings.keepAliveConfig).toEqual(
    getDefaultSettingConfig().keepAliveConfig,
  )
  expect(settings.dynamicDocumentTitle).toBe(
    getDefaultSettingConfig().dynamicDocumentTitle,
  )
  expect(settings.localeLanguage).toBe('en-US')
  expect(settings.watermarkSwitch).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toBe('general.resetDone')
})

it('clears inactive KeepAlive instances only after confirmation without reloading the active page', async () => {
  const cache = piniaKeepAliveStore()
  const active = ref('Alpha')
  const unmountedAlpha = vi.fn()
  const unmountedBeta = vi.fn()
  const alphaCreated = vi.fn()
  const pages = {
    Alpha: defineComponent({
      name: 'PageAlpha',
      setup() {
        alphaCreated()
        onUnmounted(unmountedAlpha)

        return () => h('div', 'Alpha')
      },
    }),
    Beta: defineComponent({
      name: 'PageBeta',
      setup() {
        onUnmounted(unmountedBeta)

        return () => h('div', 'Beta')
      },
    }),
  }

  cache.keepAliveInclude = ['PageAlpha', 'PageBeta']
  const host = mount(
    defineComponent({
      setup: () => () =>
        h(KeepAlive, { include: cache.keepAliveInclude }, () =>
          h(pages[active.value as keyof typeof pages]),
        ),
    }),
  )

  try {
    active.value = 'Beta'
    await nextTick()
    invoke(button('general.clearCache').props('onClick'))
    await nextTick()
    expect(cache.keepAliveInclude).toEqual(['PageAlpha', 'PageBeta'])
    expect(unmountedAlpha).not.toHaveBeenCalled()
    confirmAction()
    await nextTick()

    expect(cache.keepAliveInclude).toEqual([])
    expect(unmountedAlpha).toHaveBeenCalledOnce()
    expect(unmountedBeta).not.toHaveBeenCalled()
    expect(host.text()).toBe('Beta')
    active.value = 'Alpha'
    await nextTick()
    expect(alphaCreated).toHaveBeenCalledTimes(2)
  } finally {
    host.unmount()
  }
})

it('clears only the current account recent visits after confirmation and preserves favorites', async () => {
  const history = piniaNavigationHistoryStore()

  history.recordVisit('/reports')
  history.toggleFavorite('/reports')
  await nextTick()
  invoke(button('general.clearRecent').props('onClick'))
  await nextTick()
  expect(history.recentPaths).toEqual(['/reports'])
  confirmAction()
  await nextTick()
  expect(history.recentPaths).toEqual([])
  expect(history.favoritePaths).toEqual(['/reports'])
  expect(wrapper.get('[role="status"]').text()).toBe('general.recentCleared')
})

it('reports a storage failure instead of claiming that history changes were saved', async () => {
  const history = piniaNavigationHistoryStore()

  history.recordVisit('/reports')
  await nextTick()
  invoke(button('general.clearRecent').props('onClick'))
  const write = vi
    .spyOn(window.localStorage, 'setItem')
    .mockImplementation(() => {
      throw new Error('Storage unavailable')
    })

  try {
    confirmAction()
    await nextTick()
    expect(history.recentPaths).toEqual([])
    expect(history.storageUnavailable).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toBe(
      'general.historyStorageUnavailable',
    )
    expect(wrapper.get('[role="alert"]').text()).toBe(
      'general.historyStorageUnavailable',
    )
  } finally {
    write.mockRestore()
  }
})

it('uses the store-owned remount timer and scrolls content without changing navigation state', async () => {
  vi.useFakeTimers()
  const runtime = piniaRuntimeStore()

  invoke(button('general.refresh').props('onClick'))
  await nextTick()
  expect(runtime.globalMainLayoutLoad).toBe(false)
  expect(button('general.refresh').props('loading')).toBe(true)
  await vi.advanceTimersByTimeAsync(800)
  expect(runtime.globalMainLayoutLoad).toBe(true)
  runtime.globalDrawerValue = true
  invoke(button('general.scrollTop').props('onClick'))
  await nextTick()
  expect(state.scrollTo).toHaveBeenCalledWith({
    top: 0,
    left: 0,
    behavior: 'auto',
  })
  expect(runtime.globalDrawerValue).toBe(true)
})
