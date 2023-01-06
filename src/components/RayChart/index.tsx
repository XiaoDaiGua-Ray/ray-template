import './index.scss'

import * as echarts from 'echarts/core' // `echarts` 核心模块
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  AriaComponent,
} from 'echarts/components' // 提示框, 标题, 直角坐标系, 数据集, 内置数据转换器等组件(组件后缀都为 `Component`)
import {
  BarChart,
  LineChart,
  PieChart,
  CandlestickChart,
  ScatterChart,
} from 'echarts/charts' // 系列类型(后缀都为 `SeriesOption`)
import { LabelLayout, UniversalTransition } from 'echarts/features' // 标签自动布局, 全局过渡动画等特性
import { CanvasRenderer } from 'echarts/renderers' // `echarts` 渲染器

import { useSetting } from '@/store'
import { cloneDeep } from 'lodash-es'
import { on, off, addStyle } from '@/utils/element'

import type { PropType } from 'vue'

export type AutoResize =
  | boolean
  | {
      width: number
      height: number
    }

export interface LoadingOptions {
  text: string // 文本内容
  color: string // 颜色
  textColor: string // 字体颜色
  maskColor: string // 遮罩颜色
  zlevel: number // 水平
  fontSize: number // 字体大小
  showSpinner: boolean // 是否显示旋转动画(`spinner`)
  spinnerRadius: number // 旋转动画(`spinner`)的半径
  lineWidth: number // 旋转动画(`spinner`)的线宽
  fontWeight: string // 字体粗细
  fontStyle: string // 字体风格
  fontFamily: string // 字体系列
}

export type ChartTheme = 'dark' | '' | object

/**
 *
 * @returns LoadingOptions
 *
 * 为了方便使用加载动画, 写了此方法, 虽然没啥用
 */
export const loadingOptions = (options: LoadingOptions) =>
  Object.assign(
    {},
    {
      text: 'loading',
      color: '#c23531',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.9)',
      zlevel: 0,
      fontSize: 12,
      showSpinner: true,
      spinnerRadius: 10,
      lineWidth: 5,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontFamily: 'sans-serif',
    },
    options,
  )

const RayChart = defineComponent({
  name: 'RayChart',
  props: {
    width: {
      /* `chart` 容器宽度, 默认撑满 */
      type: String,
      default: '100%',
    },
    height: {
      /* `chart` 容器高度, 默认撑满 */
      type: String,
      default: '100%',
    },
    autoResize: {
      /**
       *
       * `chart` 是否跟随窗口尺寸变化自动变化
       *
       * 如果为对象, 则可以指定其变化尺寸, 实现图表大小不等于容器大小的效果
       */
      type: [Boolean, Object] as PropType<AutoResize>,
      default: true,
    },
    canvasRender: {
      /**
       *
       * `chart` 渲染器, 默认使用 `canvas`
       *
       * 考虑到打包体积与大多数业务场景缘故, 暂时移除 `SVGRenderer` 渲染器的默认导入
       */
      type: Boolean,
      default: true,
    },
    showAria: {
      /**
       *
       * 是否开启 `chart` 无障碍访问
       *
       * 此选项会覆盖 `options` 中的 `aria` 配置
       */
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    success: {
      /**
       *
       * @param `chart` 实例
       *
       * 渲染成功回调函数
       */
      type: Function,
      default: () => ({}),
    },
    error: {
      /**
       *
       * 渲染失败回调函数
       */
      type: Function,
      default: () => ({}),
    },
    theme: {
      type: [String, Object] as PropType<ChartTheme>,
      default: '',
    },
    autoChangeTheme: {
      /**
       *
       * 是否自动跟随模板主题切换
       *
       * 如果开启此属性, 则会覆盖 `theme` 属性
       *
       * 注意: 这个属性重度依赖此模板, 所以默认不开启. 并且动态切换主题有一定的性能问题
       */
      type: Boolean,
      default: false,
    },
    use: {
      /**
       *
       * 拓展 `echarts` 图表
       *
       * 由于官方并没有提供该类型, 手动去复刻成本过高, 故而采用 `any`
       */
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const settingStore = useSetting()
    const { themeValue } = storeToRefs(settingStore)
    const rayChartRef = ref<HTMLElement>() // `echart` 容器实例
    const echartInstanceRef = ref<EChartsInstance>() // `echart` 拷贝实例, 解决直接使用响应式实例带来的问题
    let echartInstance: EChartsInstance // `echart` 实例

    const cssVarsRef = computed(() => {
      const cssVars = {
        '--ray-chart-width': props.width,
        '--ray-chart-height': props.height,
      }

      return cssVars
    })

    /**
     *
     * 注册 `echart` 组件, 图利, 渲染器等
     *
     * 会自动合并拓展 `echart` 组件
     *
     * 该方法必须在注册图表之前调用
     */
    const registerChartCore = async () => {
      echarts.use([
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        ToolboxComponent,
        AriaComponent,
      ]) // 注册组件

      echarts.use([
        BarChart,
        LineChart,
        PieChart,
        CandlestickChart,
        ScatterChart,
      ]) // 注册类型

      echarts.use([LabelLayout, UniversalTransition]) // 注册布局, 过度效果

      // 如果业务场景中需要 `svg` 渲染器, 手动导入渲染器后使用该行代码即可
      // echarts.use([props.canvasRender ? CanvasRenderer : SVGRenderer])
      echarts.use([CanvasRenderer]) // 注册渲染器

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        echarts.use(props.use as any[])
      } catch (e) {
        console.error(
          'Error: wrong property and method passed in extend attribute',
        )
      }
    }

    /**
     *
     * @returns `chart options`
     *
     * 合并配置项
     *
     * 如果有需要特殊全局配置的可以在此继续写...
     */
    const useMergeOptions = () => {
      let options = cloneDeep(props.options)

      const merge = (opts: object) => Object.assign({}, options, opts)

      if (props.showAria) {
        options = merge({
          aria: {
            enabled: true,
            decal: {
              show: true,
            },
          },
        })
      }

      return options
    }

    /**
     *
     * 渲染 `echart`
     *
     * 缓存两个实例
     *
     * 直接使用响应式代理实例会出现诡异的问题, 例如 `legend` 点击时报错
     */
    const renderChart = (theme: ChartTheme) => {
      const element = rayChartRef.value as HTMLElement
      const options = useMergeOptions()
      const { height, width } = element.getBoundingClientRect()

      if (height === 0) {
        addStyle(element, {
          height: '200px',
        })
      }

      if (width === 0) {
        addStyle(element, {
          width: '200px',
        })
      }

      try {
        echartInstance = echarts.init(element, theme)
        echartInstanceRef.value = echartInstance

        options && echartInstance.setOption(options)

        props.success?.(echartInstance)
      } catch (e) {
        props.error?.()
      }
    }

    /**
     *
     * @param bool 渲染带有主题色的可视化图
     * @returns void 0
     *
     * 区别自动跟随模板主题切换与指定主题切换
     */
    const renderThemeChart = (bool?: boolean) => {
      if (props.autoChangeTheme) {
        bool ? renderChart('dark') : renderChart('')

        return void 0
      }

      if (!props.theme) {
        renderChart('')
      }
    }

    /**
     *
     * 销毁 `chart` 实例, 释放资源
     */
    const destroyChart = () => {
      if (echartInstance) {
        echartInstance.clear()
        echartInstance.dispose()
      }
    }

    const resizeChart = () => {
      if (echartInstance) {
        echartInstance.resize()
      }
    }

    watch(
      () => [themeValue.value],
      ([theme]) => {
        if (props.autoChangeTheme) {
          destroyChart()

          renderThemeChart(theme)
        }
      },
    )

    watch(
      () => props.showAria,
      () => {
        destroyChart()

        /**
         *
         * 贴花跟随主题渲染
         *
         * 自动跟随模板主题或者指定主题皆可
         */
        if (props.autoChangeTheme || props.theme) {
          themeValue.value ? renderChart('dark') : renderChart('')
        } else {
          renderChart('')
        }
      },
    )

    onBeforeMount(async () => {
      await registerChartCore()
    })

    onMounted(() => {
      nextTick(() => {
        if (props.autoChangeTheme) {
          renderThemeChart(themeValue.value)
        } else {
          props.theme ? renderChart('dark') : renderChart('')
        }

        if (props.autoResize) {
          on(window, 'resize', resizeChart)
        }
      })
    })

    onBeforeUnmount(() => {
      destroyChart()
      off(window, 'resize', resizeChart)
    })

    return {
      rayChartRef,
      cssVarsRef,
      echartInstance: echartInstanceRef,
    }
  },
  render() {
    return (
      <div class="ray-chart" style={[this.cssVarsRef]} ref="rayChartRef"></div>
    )
  },
})

export default RayChart

/**
 *
 * 基于 `echarts` 的组件. 意在便捷的使用 `chart` 图
 *
 * 暂时不支持自动解析导入 `chart` 组件, 如果使用未注册的组件, 需要在顶部手动导入并且再使用 `use` 注册
 *
 * 预引入: 柱状图, 折线图, 饼图, k线图, 散点图等
 *
 * 预引入: 提示框, 标题, 直角坐标系, 数据集, 内置数据转换器等
 *
 * 如果需要大批量数据渲染, 可以通过获取实例后阶段性调用 `setOption` 方法注入数据
 *
 * 该组件会在卸载组件时, 自动释放资源
 *
 * 注意: 尽量别一次性倒入全部 `chart` 会造成打包体积异常大
 */
