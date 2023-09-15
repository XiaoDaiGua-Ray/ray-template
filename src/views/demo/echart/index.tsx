import './index.scss'

import { NCard, NSwitch, NSpace, NP, NH2, NButton } from 'naive-ui'
import RayChart from '@/components/RChart/index'

import dayjs from 'dayjs'

import type { ECharts } from 'echarts/core'
import type { RayChartInst } from '@/components/RChart/index'

const Echart = defineComponent({
  name: 'REchart',
  setup() {
    const baseChartRef = ref<RayChartInst>()
    const chartLoading = ref(false)
    const chartAria = ref(false)
    const state = reactive({
      loading: false,
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
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
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
      title: {
        text: dayjs().valueOf(),
      },
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
      toolbox: {
        feature: {
          saveAsImage: {},
        },
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

    const handleChartRenderSuccess = (chart: ECharts) => {
      window.$notification.info({
        title: '可视化图渲染成功回调函数',
        content: '可视化图渲染成功, 并且返回了当前可视化图实例',
        duration: 5 * 1000,
      })

      console.log(baseChartRef.value, chart)
    }

    const mountChart = () => {
      baseChartRef.value?.render()
    }

    const unmountChart = () => {
      baseChartRef.value?.dispose()
    }

    const handleUpdateTitle = () => {
      baseLineOptions.value.title.text = dayjs().valueOf()

      const createData = () => Math.floor((Math.random() + 1) * 100)

      baseLineOptions.value.series[0].data = new Array(7)
        .fill(0)
        .map(() => createData())
      baseLineOptions.value.series[1].data = new Array(7)
        .fill(0)
        .map(() => createData())
    }

    return {
      baseOptions,
      baseChartRef,
      chartLoading,
      handleLoadingShow,
      chartAria,
      handleAriaShow,
      handleChartRenderSuccess,
      basePieOptions,
      baseLineOptions,
      ...toRefs(state),
      mountChart,
      unmountChart,
      handleUpdateTitle,
    }
  },
  render() {
    return (
      <div class="echart">
        <NCard title="chart 组件">
          <ul>
            <li>
              <h3>当未获取到宽高时，组件会默认以 200*200 尺寸填充。</h3>
            </li>
            <li>
              <h3>
                默认启用 autoChangeTheme，自动监听模板主题变化（RayTemplate
                独有）
              </h3>
            </li>
            <li>
              <h3>默认启用 watchOptions，自动监听配置项变化</h3>
            </li>
            <li>
              <h3>默认启用 animation，强制启用渲染过渡动画</h3>
            </li>
            <li>
              <h3>配置 setChartOptions 属性，可以定制化合并模式</h3>
            </li>
          </ul>
        </NCard>
        <NH2>强制渲染过渡动画（animation）</NH2>
        <NSpace style={['padding: 18px 0']}>
          <NButton onClick={this.mountChart.bind(this)}>渲染</NButton>
          <NButton onClick={this.unmountChart.bind(this)}>卸载</NButton>
          <NButton onClick={this.handleUpdateTitle.bind(this)}>
            更新配置项
          </NButton>
        </NSpace>
        <div class="chart--container">
          <RayChart
            ref="baseChartRef"
            autoChangeTheme
            options={this.baseLineOptions}
            showAria={this.chartAria}
          />
        </div>
        <NH2>不跟随主题切换的暗色主题可视化图</NH2>
        <div class="chart--container">
          <RayChart
            autoChangeTheme={false}
            theme="dark"
            options={this.baseOptions}
          />
        </div>
        <NH2>加载动画</NH2>
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
          <RayChart loading={this.loading} options={this.baseOptions} />
        </div>
        <NH2>贴画可视化图</NH2>
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
          <RayChart options={this.baseOptions} showAria={this.chartAria} />
        </div>
      </div>
    )
  },
})

export default Echart
