import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'
import './index.scss'
import { getDemoCharts } from '@/api/demo/data'
import type { DemoCharts } from '@/api/demo/data'
import { RChart, useChart } from '@/components'
import { useI18n } from '@/hooks'
import { NButton, NCard, NFlex, NSwitch } from 'naive-ui'

const Echart = defineComponent({
  name: 'REchart',
  setup() {
    const [register, { dispose, render }] = useChart()
    const [register2, { dispose: dispose2, render: render2 }] = useChart()
    const { t } = useI18n('demoDetails.chart')
    const chartData = shallowRef<DemoCharts>()
    const requestController = new AbortController()

    onScopeDispose(() => requestController.abort())

    const chartLoading = ref(false)
    const chartAria = ref(false)
    const state = reactive({
      loading: false,
      loading1: false,
      lineReady: false,
      lineVisible: false,
      barReady: false,
      barVisible: false,
      revision: 1,
    })

    const baseOptions = computed<GlobalEChartsCoreOption>(() => ({
      legend: { type: 'scroll', top: 0 },
      tooltip: { trigger: 'axis' },
      grid: { left: 44, right: 14, top: 42, bottom: 26 },
      xAxis: {
        type: 'category',
        data: chartData.value?.days ?? [],
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: t('orders'),
          data: chartData.value?.orders ?? [],
          type: 'bar',
          barMaxWidth: 24,
        },
        {
          name: t('visits'),
          data: chartData.value?.visits ?? [],
          type: 'bar',
          barMaxWidth: 24,
        },
      ],
    }))
    const pieOptions = computed<GlobalEChartsCoreOption>(() => ({
      tooltip: { trigger: 'item' },
      legend: { type: 'scroll', bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '68%'],
          center: ['50%', '46%'],
          label: { show: false },
          data: (chartData.value?.sources ?? []).map(({ key, value }) => ({
            value,
            name: t(key),
          })),
        },
      ],
    }))
    const baseLineOptions = computed(() => ({
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { type: 'scroll', bottom: 0 },
      grid: { left: 52, right: 20, top: 20, bottom: 58 },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: chartData.value?.days ?? [],
        },
      ],
      yAxis: [{ type: 'value' }],
      series: (chartData.value?.lines ?? []).map((line) => ({
        name: line.name,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: line.values,
      })),
    }))

    const handleLoadingShow = (bool: boolean) => {
      state.loading = bool
    }

    const handleAriaShow = (bool: boolean) => {
      chartAria.value = bool
    }

    const unmountChart = () => {
      dispose()
      state.lineVisible = false
    }

    const loadCharts = async (refresh = false) => {
      state.loading1 = true

      try {
        chartData.value = await getDemoCharts(refresh, requestController.signal)

        if (refresh) state.revision += 1
      } catch {
        if (!requestController.signal.aborted)
          window.$message.error(t('loadFailed'))
      } finally {
        state.loading1 = false
      }
    }

    void loadCharts()
    const updateChartOptions = () => {
      void loadCharts(true)
    }

    return {
      baseOptions,
      chartLoading,
      handleLoadingShow,
      chartAria,
      handleAriaShow,
      pieOptions,
      baseLineOptions,
      ...toRefs(state),
      mountChart: render,
      unmountChart,
      updateChartOptions,
      register,
      register2,
      dispose2,
      render2,
    }
  },
  render() {
    const { register, register2, dispose2, render2, loading1 } = this

    return (
      <DemoPage
        title={this.$t('menu.Echart')}
        description={this.$t('showcase.chartDescription')}
        eyebrow="RAY TEMPLATE / EXAMPLES"
      >
        <div class="echart">
          <section class="echart__lead">
            <NFlex align="center">
              <NButton
                disabled={!this.lineReady || this.lineVisible}
                onClick={this.mountChart}
              >
                {this.$t('demoDetails.chart.mount')}
              </NButton>
              <NButton disabled={!this.lineVisible} onClick={this.unmountChart}>
                {this.$t('demoDetails.chart.dispose')}
              </NButton>
              <NButton
                disabled={!this.lineVisible || loading1}
                onClick={this.updateChartOptions}
              >
                {this.$t('demoDetails.chart.update')}
              </NButton>
              <NButton
                onClick={() => {
                  this.loading1 = !this.loading1
                }}
              >
                {this.$t(
                  loading1
                    ? 'demoDetails.chart.stopLoading'
                    : 'demoDetails.chart.showLoading',
                )}
              </NButton>
            </NFlex>
            <div class="chart--container">
              <RChart
                onRegister={register}
                onSuccess={() => {
                  this.lineReady = true
                  this.lineVisible = true
                }}
                title={this.$t('demoDetails.chart.sales')}
                autoChangeTheme
                options={this.baseLineOptions}
                showAria={this.chartAria}
                preset="card"
                loading={loading1}
              />
            </div>
            <DemoResult label={this.$t('demoDetails.chart.series')}>
              {this.lineVisible
                ? this.$t('demoDetails.chart.revision', {
                    value: this.revision,
                  })
                : this.$t('demoDetails.chart.unmounted')}
            </DemoResult>
          </section>
          <div class="echart__examples">
            <NCard title={this.$t('demoDetails.chart.fixedTheme')}>
              <NFlex vertical>
                <NFlex>
                  <NButton
                    disabled={!this.barReady || this.barVisible}
                    onClick={render2}
                  >
                    {this.$t('demoDetails.chart.mount')}
                  </NButton>
                  <NButton
                    disabled={!this.barVisible}
                    onClick={() => {
                      dispose2()
                      this.barVisible = false
                    }}
                  >
                    {this.$t('demoDetails.chart.dispose')}
                  </NButton>
                </NFlex>
                <div class="chart--container">
                  <RChart
                    onRegister={register2}
                    onSuccess={() => {
                      this.barReady = true
                      this.barVisible = true
                    }}
                    theme="ray-naive"
                    options={this.baseOptions}
                  />
                </div>
              </NFlex>
            </NCard>
            <NCard title={this.$t('demoDetails.chart.showLoading')}>
              <NSwitch
                v-model:value={this.chartLoading}
                onUpdateValue={this.handleLoadingShow.bind(this)}
                style={['padding: 18px 0']}
              >
                {{
                  checked: () => this.$t('demoDetails.chart.stopLoading'),
                  unchecked: () => this.$t('demoDetails.chart.showLoading'),
                }}
              </NSwitch>
              <div class="chart--container">
                <RChart loading={this.loading} options={this.pieOptions} />
              </div>
            </NCard>
            <NCard title={this.$t('demoDetails.chart.pattern')}>
              <NSwitch
                v-model:value={this.chartAria}
                onUpdateValue={this.handleAriaShow.bind(this)}
                style={['padding: 18px 0']}
              >
                {{
                  checked: () => this.$t('demoDetails.chart.hidePattern'),
                  unchecked: () => this.$t('demoDetails.chart.pattern'),
                }}
              </NSwitch>
              <div class="chart--container">
                <RChart options={this.baseOptions} showAria={this.chartAria} />
              </div>
            </NCard>
          </div>
        </div>
      </DemoPage>
    )
  },
})

export default Echart
