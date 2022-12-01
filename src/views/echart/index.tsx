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
      legend: {
        // data: ['日期'],
      },
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

    const handleLoadingShow = (bool: boolean) => {
      if (baseChartRef.value) {
        const { echartInstance } = baseChartRef.value

        bool ? echartInstance.showLoading() : echartInstance.hideLoading()
      }
    }

    const handleAriaShow = (bool: boolean) => {
      chartAria.value = bool
    }

    return {
      baseOptions,
      baseChartRef,
      chartLoading,
      handleLoadingShow,
      chartAria,
      handleAriaShow,
    }
  },
  render() {
    return (
      <div class="echart">
        <NCard title="RayChart组件使用">
          在使用该组件时, 一定要注意根组件的高度初始化问题,
          如果需要使用其余的图利, 需要自己手动去注册.
          该组件实现了自动跟随模板主题切换功能, 但是动态切换损耗较大,
          所以默认不启用
        </NCard>
        <NCard title="基础使用">
          <div class="chart--container">
            <RayChart options={this.baseOptions} />
          </div>
        </NCard>
        <NCard title="能跟随主题切换的可视化图">
          <div class="chart--container">
            <RayChart autoChangeTheme options={this.baseOptions} />
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
