import './index.scss'
import RayChart from '@/components/RayChart/index'
import { NCard, NSwitch } from 'naive-ui'

const Echart = defineComponent({
  name: 'Echart',
  setup() {
    const baseChartRef = ref()
    const chartLoading = ref(false)
    const chartAria = ref(false)

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
    const baseLineOptions = {
      title: {
        text: 'Stacked Area Chart',
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
    }

    const handleLoadingShow = (bool: boolean) => {
      if (baseChartRef.value) {
        const { echartInstance } = baseChartRef.value

        bool ? echartInstance.showLoading() : echartInstance.hideLoading()
      }
    }

    const handleAriaShow = (bool: boolean) => {
      chartAria.value = bool
    }

    const handleChartRenderSuccess = (chart: EChartsInstance) => {
      window.$notification.info({
        title: '可视化图渲染成功回调函数',
        content: '可视化图渲染成功, 并且返回了当前可视化图实例',
        duration: 5 * 1000,
      })

      console.log(chart)
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
    }
  },
  render() {
    return (
      <div class="echart">
        <NCard title="RayChart组件使用">
          在使用该组件时, 一定要注意根组件的高度初始化问题,
          如果需要使用其余的图例, 需要自己手动去注册.
          该组件实现了自动跟随模板主题切换功能, 但是动态切换损耗较大,
          所以默认不启用
        </NCard>
        <NCard title="基础使用">
          <div class="chart--container">
            <RayChart options={this.baseOptions} />
          </div>
        </NCard>
        <NCard title="渲染成功后运行回调函数">
          <div class="chart--container">
            <RayChart
              options={this.basePieOptions}
              success={this.handleChartRenderSuccess.bind(this)}
            />
          </div>
        </NCard>
        <NCard title="能跟随主题切换的可视化图">
          <div class="chart--container">
            <RayChart
              autoChangeTheme
              options={this.baseLineOptions}
              showAria={this.chartAria}
            />
          </div>
        </NCard>
        <NCard title="不跟随主题切换的暗色主题可视化图">
          <div class="chart--container">
            <RayChart theme="dark" options={this.baseOptions} />
          </div>
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
            <RayChart ref="baseChartRef" options={this.baseOptions} />
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
            <RayChart options={this.baseOptions} showAria={this.chartAria} />
          </div>
        </NCard>
      </div>
    )
  },
})

export default Echart
