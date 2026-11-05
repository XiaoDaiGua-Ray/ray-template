import './index.scss'
import { completeSize } from '@ray-template/composables/element'
import { call, renderNode } from '@ray-template/composables/vue'
import { downloadBase64File } from '@ray-template/utils'
import {
  useEventListener,
  useIntersectionObserver,
  useResizeObserver,
} from '@vueuse/core'
import {
  BarChart,
  CandlestickChart,
  LineChart,
  PictorialBarChart,
  PieChart,
  ScatterChart,
} from 'echarts/charts'
import {
  AriaComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
import type { AriaComponentOption } from 'echarts/components'
import { init, registerTheme, use } from 'echarts/core'
import type { ECharts } from 'echarts/core'
import { LegacyGridContainLabel, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { throttle } from 'lodash-es'
import { NButton, NCard, NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import {
  computed,
  defineComponent,
  nextTick as flushView,
  inject,
  onActivated,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  useTemplateRef,
  watch,
} from 'vue'
import { RIcon } from '../../RIcon'
import { useUiServices } from '../../services'
import { USE_CHART_PROVIDER_KEY } from './config'
import props from './props'
import { getCustomEchartTheme, loadingOptions, setEchartOptions } from './utils'

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  AriaComponent,
  BarChart,
  LineChart,
  PieChart,
  CandlestickChart,
  ScatterChart,
  PictorialBarChart,
  LegacyGridContainLabel,
  UniversalTransition,
  CanvasRenderer,
])

const themes = new Map(
  getCustomEchartTheme().map(({ name, theme }) => [name, theme]),
)

for (const [name, theme] of themes) registerTheme(name, theme)

const DOWNLOAD_KEY = '__R_CHART_DOWN_LOAD_CHART__'

export default defineComponent({
  name: 'RChart',
  props,
  setup(props, { expose }) {
    const { dark, chartTheme, translate } = useUiServices()
    const provider = inject(USE_CHART_PROVIDER_KEY, {})
    const chartRef = useTemplateRef<HTMLElement>('chartRef')
    const instance = shallowRef<ECharts>()
    const renderRequest = ref<number | null>(null)
    const ready = shallowRef<{ element: HTMLElement; request: number }>()
    let requestId = 0
    let mounted = false

    const liveChart = () => {
      const chart = instance.value

      return chart && !chart.isDisposed() ? chart : void 0
    }
    const theme = computed(() => {
      if (provider.theme) return provider.theme

      const isDark = props.autoChangeTheme && dark?.()

      if (props.theme === 'default') return isDark ? 'dark' : 'default'

      if (props.theme) return props.theme

      const base = toValue(chartTheme) ?? 'ray-modern'

      const darkVariant = `${base}-dark`

      return isDark && themes.has(darkVariant) ? darkVariant : base
    })
    const cssVars = computed(() => ({
      '--r-chart-width': completeSize(props.width),
      '--r-chart-height': completeSize(props.height),
    }))
    const loadingStyle = computed(() =>
      loadingOptions(
        themes.get(theme.value),
        theme.value === 'dark' || theme.value.endsWith('-dark'),
        translate?.('chart.loading') ?? 'Loading…',
        props.loadingOptions,
      ),
    )
    const downloadLabel = computed(
      () => translate?.('chart.download') ?? 'Download image',
    )
    const moreLabel = computed(
      () => translate?.('chart.actions') ?? 'Chart actions',
    )
    const moreOptions = computed<DropdownOption[]>(() => [
      { label: downloadLabel.value, key: DOWNLOAD_KEY, disabled: !liveChart() },
    ])

    const ariaOptions = computed(() => {
      const aria = props.options.aria as AriaComponentOption | undefined

      return {
        ...aria,
        enabled: props.showAria,
        decal: { ...aria?.decal, show: props.showAria },
      }
    })
    const syncAriaLabel = (chart: ECharts) => {
      if (!props.showAria || ariaOptions.value.label?.enabled === false)
        chart.getDom().removeAttribute('aria-label')
    }
    const applyOptions = (chart: ECharts, initial = false) => {
      chart.setOption(
        { ...props.options, aria: ariaOptions.value },
        {
          ...setEchartOptions(),
          ...props.setChartOptions,
          // 初始化回调需要在图表可读取和导出后执行。
          ...(initial && { lazyUpdate: false }),
        },
      )
      syncAriaLabel(chart)
    }
    const updateLoading = (chart: ECharts) => {
      if (props.loading) chart.showLoading('default', loadingStyle.value)
      else chart.hideLoading()
    }

    const destroyChart = () => {
      const chart = liveChart()

      instance.value = void 0
      chart?.getDom().removeAttribute('aria-label')
      chart?.dispose()
    }

    const render = () => {
      if (mounted && !liveChart()) renderRequest.value = ++requestId
    }
    const dispose = () => {
      renderRequest.value = null
      ready.value = void 0
      resizeChart.cancel()
      destroyChart()
    }
    const initialize = (element: HTMLElement) => {
      let chart: ECharts

      try {
        use(props.use.filter(Boolean))
        chart = init(element, theme.value, {
          width: element.clientWidth || 200,
          height: element.clientHeight || 200,
        })
        instance.value = chart
        applyOptions(chart, true)
        updateLoading(chart)
      } catch (error) {
        destroyChart()

        try {
          props.onError && call(props.onError)
        } finally {
          props.onFinally && call(props.onFinally)
        }

        throw new Error('[RChart] 图表初始化失败', { cause: error })
      }

      try {
        props.onRegister && call(props.onRegister, chart, render, dispose)

        if (chart === liveChart() && props.onSuccess)
          call(props.onSuccess, chart)
      } finally {
        props.onFinally && call(props.onFinally)
      }
    }

    watch(
      [
        chartRef,
        renderRequest,
        () => props.intersectionObserver,
        () => props.intersectionObserverTarget,
        () => props.intersectionOptions,
      ],
      ([element, request, observe, target, options], _, onCleanup) => {
        ready.value = void 0

        const chart = liveChart()

        if (chart && chart.getDom() !== element) destroyChart()

        if (!element || request === null || liveChart()) return

        const markReady = () => {
          ready.value = { element, request }
        }

        if (!observe) {
          markReady()

          return
        }

        let active = true
        const observer = useIntersectionObserver(
          target ?? element,
          (entries) => {
            if (
              !active ||
              request !== renderRequest.value ||
              element !== chartRef.value
            )
              return

            if (entries.at(-1)?.isIntersecting) {
              observer.stop()
              markReady()
            }
          },
          { ...options, immediate: true },
        )

        onCleanup(() => {
          active = false
          observer.stop()
        })

        if (!observer.isSupported.value) markReady()
      },
      { flush: 'post' },
    )
    watch(
      ready,
      async (target) => {
        if (!target) return

        const { nextTick: defer } = props

        if (defer) await flushView()

        if (
          target === ready.value &&
          target.request === renderRequest.value &&
          target.element === chartRef.value &&
          !liveChart()
        )
          initialize(target.element)
      },
      { flush: 'post' },
    )

    const resizeChart = throttle(() => {
      const chart = liveChart()
      const element = chartRef.value

      if (!props.autoResize || !chart || chart.getDom() !== element) return

      if (element.clientWidth && element.clientHeight) {
        chart.resize({
          width: element.clientWidth,
          height: element.clientHeight,
        })
      }
    }, 100)
    const resizeObserver = useResizeObserver(
      () =>
        renderRequest.value !== null && props.autoResize
          ? (toValue(props.autoResizeObserverTarget) ?? chartRef.value)
          : null,
      resizeChart,
    )

    useEventListener('resize', () => {
      if (!resizeObserver.isSupported.value) resizeChart()
    })
    onActivated(resizeChart)

    watch(
      [
        () => props.watchOptions && renderRequest.value !== null,
        () => props.watchDeep,
        () => props.watchOptionsThrottleWait,
      ],
      ([enabled, deep, wait], _, onCleanup) => {
        if (!enabled) return

        const update = throttle((chart: ECharts) => {
          if (chart === liveChart()) applyOptions(chart)
        }, wait)
        const stop = watch(
          () => props.options,
          () => {
            const chart = liveChart()

            if (chart) update(chart)
          },
          { deep, flush: 'post' },
        )

        onCleanup(() => {
          stop()
          update.cancel()
        })
      },
      { immediate: true },
    )
    watch(
      theme,
      (name) => {
        const chart = liveChart()

        if (!chart) return

        chart.setTheme(name)

        // ECharts 6 重建选项模型时可能丢掉之后合并的 ARIA 开关。
        const aria = chart.getOption().aria as AriaComponentOption | undefined

        if (aria?.enabled !== props.showAria)
          chart.setOption({ aria: ariaOptions.value }, { silent: true })

        syncAriaLabel(chart)
      },
      { flush: 'post' },
    )
    watch(
      [() => props.loading, loadingStyle],
      () => {
        const chart = liveChart()

        if (chart) updateLoading(chart)
      },
      { flush: 'post' },
    )
    watch(
      () => props.showAria,
      () => {
        const chart = liveChart()

        if (!chart) return

        chart.setOption({ aria: ariaOptions.value })
        syncAriaLabel(chart)
      },
      { flush: 'post' },
    )

    const dropdownSelect = (key: string | number, option: DropdownOption) => {
      const chart = liveChart()

      if (key === DOWNLOAD_KEY && chart) {
        const { filename, ...args } = props.downloadOptions
        const dataUrl = chart.getDataURL(args)

        if (dataUrl) {
          const extension = dataUrl.match(/^data:image\/([a-z]+)/)?.[1] ?? 'png'

          downloadBase64File(
            dataUrl,
            filename ?? `chart-${Date.now()}.${extension}`,
          )
        }
      }

      if (props.onDropdownSelect) call(props.onDropdownSelect, key, option)
    }

    expose()
    onMounted(() => {
      mounted = true
      render()
    })
    onBeforeUnmount(() => {
      mounted = false
      dispose()
    })

    return { chartRef, cssVars, moreOptions, moreLabel, dropdownSelect }
  },
  render() {
    const { title, contentStyle, preset, bordered, dropdownOptions } = this
    const { cardExtra } = this.$slots
    const container = <div class="r-chart__container" ref="chartRef" />

    return preset === 'card' ? (
      <NCard
        class="r-chart r-chart--card"
        style={this.cssVars}
        contentClass="r-chart__body"
        contentStyle={contentStyle}
        bordered={bordered}
      >
        {{
          default: () => container,
          header: title ? renderNode(title) : void 0,
          'header-extra':
            cardExtra ??
            (() => (
              <NDropdown
                options={dropdownOptions ?? this.moreOptions}
                trigger="click"
                onSelect={this.dropdownSelect}
                placement="bottom-end"
              >
                <NButton
                  quaternary
                  size="small"
                  aria-label={this.moreLabel}
                  {...{ title: this.moreLabel }}
                >
                  {{ icon: () => <RIcon name="action/more" size={16} /> }}
                </NButton>
              </NDropdown>
            )),
        }}
      </NCard>
    ) : (
      <div class="r-chart" style={this.cssVars}>
        {container}
      </div>
    )
  },
})
