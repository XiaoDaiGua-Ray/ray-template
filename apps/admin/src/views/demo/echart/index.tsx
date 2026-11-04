import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'
import './index.scss'
import { RChart, useChart } from '@/components'
import type { RChartType } from '@/components'
import { NButton, NCard, NFlex, NSwitch } from 'naive-ui'

const Echart = defineComponent({
  name: 'REchart',
  setup() {
    const [register, { getChartInstance, dispose, render, isDisposed }] =
      useChart()
    const [
      register2,
      {
        getChartInstance: getChartInstance2,
        dispose: dispose2,
        render: render2,
        isDisposed: isDisposed2,
      },
    ] = useChart()

    const chartLoading = ref(false)
    const chartAria = ref(false)
    const state = reactive({
      loading: false,
      loading1: false,
      lineVisible: true,
      barVisible: true,
      revision: 1,
    })

    const baseOptions: GlobalEChartsCoreOption = {
      legend: {},
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '日期',
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
        },
        {
          name: '数量',
          data: [12, 220, 250, 180, 20, 10, 190],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
        },
      ],
    }
    const basePieOptions: GlobalEChartsCoreOption = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: 1048,
              name: 'Search Engine',
            },
            {
              value: 735,
              name: 'Direct',
            },
            {
              value: 580,
              name: 'Email',
            },
            {
              value: 484,
              name: 'Union Ads',
            },
            {
              value: 300,
              name: 'Video Ads',
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    const baseLineOptions = ref({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '2%',
        outerBounds: {
          bottom: '10%',
        },
        outerBoundsMode: 'auto',
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
          label: {
            show: true,
            position: 'top',
          },
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

    const mountChart = () => {
      if (isDisposed()) {
        render()
        state.lineVisible = true
      } else {
        window.$message.warning('图表已渲染~')
      }
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
      basePieOptions,
      baseLineOptions,
      ...toRefs(state),
      mountChart,
      unmountChart,
      updateChartOptions,
      register,
      register2,
      dispose2,
      render2,
      isDisposed2,
    }
  },
  render() {
    const { register, register2, dispose2, render2, isDisposed2, loading1 } =
      this

    return (
      <DemoPage
        title={this.$t('menu.Echart')}
        description={this.$t('showcase.chartDescription')}
        eyebrow="RAY TEMPLATE / EXAMPLES"
      >
        <div class="echart">
          <NCard title={this.$t('demoDetails.chart.sales')}>
            <NFlex style={['padding: 18px 0']}>
              <NButton disabled={this.lineVisible} onClick={this.mountChart}>
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
          </NCard>
          <NCard title={this.$t('demoDetails.chart.fixedTheme')}>
            <NFlex vertical>
              <NFlex>
                <NButton
                  onClick={() => {
                    if (isDisposed2()) {
                      render2()
                      this.barVisible = true
                    } else {
                      window.$message.warning('不可以重复渲染图表~')
                    }
                  }}
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
                  autoChangeTheme={false}
                  theme="default"
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
              <RChart loading={this.loading} options={this.baseOptions} />
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
      </DemoPage>
    )
  },
})

export default Echart
