import { flushPromises, mount } from '@vue/test-utils'
import { init } from 'echarts/core'
import type { ECharts } from 'echarts/core'
import { nextTick, ref } from 'vue'
import { RChart, useChart } from '../../packages/ui/src/RChart'
import { USE_CHART_PROVIDER_KEY } from '../../packages/ui/src/RChart/src/config'
import { provideUiServices } from '../../packages/ui/src/services'

vi.mock('echarts/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('echarts/core')>()

  return { ...actual, init: vi.fn() }
})

const charts: ReturnType<typeof fakeChart>[] = []
const fakeChart = (element: HTMLElement) => {
  let disposed = false
  let option = {}

  return {
    getDom: () => element,
    getOption: () => option,
    isDisposed: () => disposed,
    dispose: vi.fn(() => {
      disposed = true
    }),
    setOption: vi.fn((next) => {
      option = { ...option, ...next }
    }),
    setTheme: vi.fn(),
    resize: vi.fn(),
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
  }
}

beforeEach(() => {
  charts.length = 0
  vi.mocked(init).mockReset()
  vi.mocked(init).mockImplementation((element) => {
    const chart = fakeChart(element as HTMLElement)

    charts.push(chart)

    return chart as unknown as ECharts
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

it('updates the live chart on style and color mode changes and resumes only on render', async () => {
  const dark = ref(false)
  const style = ref('ray-modern')
  const [register, actions] = useChart()
  const wrapper = mount({
    setup() {
      provideUiServices({
        dark: () => dark.value,
        chartTheme: () => style.value,
      })

      return () => <RChart intersectionObserver={false} onRegister={register} />
    },
  })

  try {
    await flushPromises()

    expect(init).toHaveBeenLastCalledWith(
      expect.anything(),
      'ray-modern',
      expect.anything(),
    )
    expect(actions.getChartInstance().echartInst).toBe(charts[0])

    style.value = 'ray-material'
    await nextTick()
    dark.value = true
    await nextTick()

    expect(charts[0].setTheme.mock.calls).toEqual([
      ['ray-material'],
      ['ray-material-dark'],
    ])
    expect(init).toHaveBeenCalledTimes(1)
    expect(actions.isDisposed()).toBe(false)

    actions.dispose()
    style.value = 'ray-plain'
    await flushPromises()

    expect(charts[0].dispose).toHaveBeenCalledOnce()
    expect(init).toHaveBeenCalledTimes(1)

    actions.render()
    await flushPromises()

    expect(init).toHaveBeenLastCalledWith(
      expect.anything(),
      'ray-plain-dark',
      expect.anything(),
    )
    expect(actions.getChartInstance().echartInst).toBe(charts[1])
  } finally {
    wrapper.unmount()
  }
})

it('applies options and custom loading before callbacks, and preserves caller ARIA settings', async () => {
  const calls: string[] = []
  const wrapper = mount(RChart, {
    props: {
      intersectionObserver: false,
      loading: true,
      loadingOptions: {
        text: 'Collecting data',
        color: '#123456',
        showSpinner: false,
      },
      options: {
        aria: { label: { description: 'Weekly sales' }, decal: { decals: [] } },
      },
      showAria: true,
      onRegister: () => calls.push('register'),
      onSuccess: (chart) => {
        expect(chart.getOption()).toMatchObject({ aria: { enabled: true } })
        calls.push('success')
      },
      onFinally: () => calls.push('finally'),
    },
  })

  try {
    await flushPromises()

    expect(calls).toEqual(['register', 'success', 'finally'])
    expect(charts[0].getOption()).toMatchObject({
      aria: {
        enabled: true,
        label: { description: 'Weekly sales' },
        decal: { show: true, decals: [] },
      },
    })
    expect(charts[0].showLoading).toHaveBeenCalledWith(
      'default',
      expect.objectContaining({
        text: 'Collecting data',
        color: '#123456',
        showSpinner: false,
      }),
    )

    charts[0].getDom().setAttribute('aria-label', 'Weekly sales')
    await wrapper.setProps({ showAria: false })

    expect(charts[0].getDom().hasAttribute('aria-label')).toBe(false)
    expect(charts[0].getOption()).toMatchObject({ aria: { enabled: false } })
  } finally {
    wrapper.unmount()
  }
})

it('reports a deferred setOption failure and disposes the partial instance', async () => {
  const error = new Error('Invalid option')
  const onError = vi.fn()
  const onFinally = vi.fn()
  const onSuccess = vi.fn()
  const onRegister = vi.fn()
  const errorHandler = vi.fn()

  vi.mocked(init).mockImplementationOnce((element) => {
    const chart = fakeChart(element as HTMLElement)

    chart.setOption.mockImplementationOnce(() => {
      throw error
    })
    charts.push(chart)

    return chart as unknown as ECharts
  })
  const wrapper = mount(RChart, {
    props: {
      intersectionObserver: false,
      onError,
      onFinally,
      onRegister,
      onSuccess,
    },
    global: { config: { errorHandler } },
  })

  try {
    await flushPromises()

    expect(charts[0].dispose).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledOnce()
    expect(onFinally).toHaveBeenCalledOnce()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onRegister).not.toHaveBeenCalled()
    expect(errorHandler.mock.calls[0][0].cause).toBe(error)
  } finally {
    wrapper.unmount()
  }
})

it('defers offscreen initialization, even when the theme changes', async () => {
  let visible: () => void = () => {}
  const disconnect = vi.fn()

  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      visible = () =>
        callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        )
    }
    observe() {}
    disconnect = disconnect
  }

  vi.stubGlobal('IntersectionObserver', Observer)
  const dark = ref(false)
  const wrapper = mount({
    setup() {
      provideUiServices({ dark: () => dark.value })

      return () => <RChart theme="default" />
    },
  })

  try {
    await flushPromises()
    dark.value = true
    await nextTick()

    expect(init).not.toHaveBeenCalled()

    visible()
    await flushPromises()

    expect(disconnect).toHaveBeenCalled()
    expect(init).toHaveBeenLastCalledWith(
      expect.anything(),
      'dark',
      expect.anything(),
    )
    dark.value = false
    await nextTick()
    expect(charts[0].setTheme).toHaveBeenCalledWith('default')
  } finally {
    wrapper.unmount()
  }
})

it('honors a fixed Provider theme when appearance changes', async () => {
  const dark = ref(false)
  const wrapper = mount(
    {
      setup() {
        provideUiServices({ dark: () => dark.value })

        return () => <RChart intersectionObserver={false} theme="default" />
      },
    },
    {
      global: {
        provide: { [USE_CHART_PROVIDER_KEY]: { theme: 'ray-naive-dark' } },
      },
    },
  )

  try {
    await flushPromises()
    dark.value = true
    await nextTick()

    expect(init).toHaveBeenLastCalledWith(
      expect.anything(),
      'ray-naive-dark',
      expect.anything(),
    )
    expect(charts[0].setTheme).not.toHaveBeenCalled()
  } finally {
    wrapper.unmount()
  }
})
