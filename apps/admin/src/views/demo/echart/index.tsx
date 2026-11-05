import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'
import './index.scss'
import { RChart, useChart } from '@/components'
import { useI18n } from '@/hooks'
import { NButton, NCard, NFlex, NSwitch } from 'naive-ui'

const Echart = defineComponent({
  name: 'REchart',
  setup() {
    const [register, { dispose, render }] = useChart()
    const [register2, { dispose: dispose2, render: render2 }] = useChart()
    const { t } = useI18n('demoDetails.chart')

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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: t('orders'),
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          barMaxWidth: 24,
        },
        {
          name: t('visits'),
          data: [12, 220, 250, 180, 20, 10, 190],
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
          data: [
            { value: 1048, name: t('search') },
            { value: 735, name: t('direct') },
            { value: 580, name: t('email') },
            { value: 484, name: t('ads') },
          ],
        },
      ],
    }))
    const baseLineOptions = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        type: 'scroll',
        bottom: 0,
      },
      grid: {
        left: 52,
        right: 20,
        top: 20,
        bottom: 58,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: 'Direct',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: 'Search Engine',
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    })

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

    const updateChartOptions = () => {
      state.loading1 = true

      const createData = () => Math.floor((Math.random() + 1) * 100)

      setTimeout(() => {
        baseLineOptions.value.series[0].data = new Array(7)
          .fill(0)
          .map(() => createData())
        baseLineOptions.value.series[1].data = new Array(7)
          .fill(0)
          .map(() => createData())

        state.loading1 = false
        state.revision += 1
      }, 1000)
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
