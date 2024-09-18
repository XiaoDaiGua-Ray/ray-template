import './index.scss'

import { NCard, NSwitch, NFlex, NButton } from 'naive-ui'
import { RChart } from '@/components'

import { useChart } from '@/components'

import type { RChartType } from '@/components'

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
    })

    const baseOptions = {
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
    const basePieOptions = {
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
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
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
      } else {
        window.$message.warning('图表已渲染~')
      }
    }

    const unmountChart = () => {
      dispose()
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
      <div class="echart">
        <NCard title="chart 组件">
          <h3>该组件基于 ECharts, Vueuse 封装。默认做了最佳的优化封装实践。</h3>
          <h3>
            开箱即用的优化策略：节流更新图表、异步渲染、自动销毁、贴花、加载、主题、视窗区域渲染、自动更新尺寸等高级特性。
          </h3>
        </NCard>
        <NCard title="预设 card 风格图表">
          <NFlex style={['padding: 18px 0']}>
            <NButton onClick={this.mountChart.bind(this)}>渲染</NButton>
            <NButton onClick={this.unmountChart.bind(this)}>卸载</NButton>
            <NButton onClick={this.updateChartOptions.bind(this)}>
              更新配置项
            </NButton>
            <NButton
              onClick={() => {
                this.loading1 = !this.loading1
              }}
            >
              {`${this.loading1 ? '关闭' : '开启'}`}加载动画
            </NButton>
          </NFlex>
          <div class="chart--container">
            <RChart
              onRegister={register}
              title="周销售量"
              autoChangeTheme
              options={this.baseLineOptions}
              showAria={this.chartAria}
              preset="card"
              loading={loading1}
            />
          </div>
        </NCard>
        <NCard title="不跟随主题切换的暗色主题可视化图，并且手动指定原始主题色">
          <NFlex vertical>
            <NFlex>
              <NButton
                onClick={() => {
                  if (isDisposed2()) {
                    render2()
                  } else {
                    window.$message.warning('不可以重复渲染图表~')
                  }
                }}
              >
                渲染
              </NButton>
              <NButton onClick={dispose2.bind(this)}>卸载</NButton>
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
        <NCard title="加载动画">
          <NSwitch
            v-model:value={this.chartLoading}
            onUpdateValue={this.handleLoadingShow.bind(this)}
            style={['padding: 18px 0']}
          >
            {{
              checked: () => '隐藏加载动画',
              unchecked: () => '显示加载动画',
            }}
          </NSwitch>
          <div class="chart--container">
            <RChart loading={this.loading} options={this.baseOptions} />
          </div>
        </NCard>
        <NCard title="贴画可视化图">
          <NSwitch
            v-model:value={this.chartAria}
            onUpdateValue={this.handleAriaShow.bind(this)}
            style={['padding: 18px 0']}
          >
            {{
              checked: () => '隐藏贴花',
              unchecked: () => '显示贴花',
            }}
          </NSwitch>
          <div class="chart--container">
            <RChart options={this.baseOptions} showAria={this.chartAria} />
          </div>
        </NCard>
      </div>
    )
  },
})

export default Echart
