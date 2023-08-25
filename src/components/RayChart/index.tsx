/**
 *
 * 基于 `echarts` 的组件. 意在便捷的使用 `chart` 图
 *
 * 暂时不支持自动解析导入 `chart` 组件, 如果使用未注册的组件, 需要在顶部手动导入并且再使用 `use` 注册
 *
 * 预引入: 柱状图, 折线图, 饼图, k线图, 散点图等
 * 预引入: 提示框, 标题, 直角坐标系, 数据集, 内置数据转换器等
 *
 * 如果需要大批量数据渲染, 可以通过获取实例后阶段性调用 `setOption` 方法注入数据
 *
 * 该组件会在卸载组件时, 自动释放资源
 *
 * 注意: 尽量别一次性倒入全部 `chart` 会造成打包体积异常大
 */

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
  PictorialBarChart,
} from 'echarts/charts' // 系列类型(后缀都为 `SeriesOption`)
import { LabelLayout, UniversalTransition } from 'echarts/features' // 标签自动布局, 全局过渡动画等特性
import {
  CanvasRenderer,
  // SVGRenderer,
} from 'echarts/renderers' // `echarts` 渲染器

import { useSetting } from '@/store'
import { cloneDeep, throttle } from 'lodash-es'
import { on, off, completeSize } from '@/utils/element'
import { call } from '@/utils/vue/index'
import { setupChartTheme, loadingOptions } from './helper'
import { APP_THEME } from '@/appConfig/designConfig'

import type { PropType } from 'vue'
import type { AnyFC, MaybeArray } from '@/types/modules/utils'
import type { DebouncedFunc } from 'lodash-es'
import type {
  LoadingOptions,
  AutoResize,
  ChartTheme,
} from '@/components/RayChart/type'
import type {
  UseResizeObserverReturn,
  MaybeComputedElementRef,
  MaybeElement,
} from '@vueuse/core'
import type { ECharts, EChartsCoreOption, SetOptionOpts } from 'echarts/core'

export type EChartsExtensionInstallRegisters = typeof CanvasRenderer
export type { RayChartInst } from './type'

const RayChart = defineComponent({
  name: 'RayChart',
  props: {
    width: {
      /**
       *
       * chart 容器初始化宽度
       *
       * 如果未能继承宽度, 则会以 200px 宽度填充
       */
      type: String,
      default: '100%',
    },
    height: {
      /**
       *
       * chart 容器初始化高度
       *
       * 如果未能继承高度, 则会以 200px 宽度填充
       */
      type: String,
      default: '100%',
    },
    autoResize: {
      /**
       *
       * `chart` 是否跟随窗口尺寸变化自动变化
       *
       * 如果为对象, 则可以指定其变化尺寸, 实现图表大小不等于容器大小的效果
       * 默认每秒触发一次的频率
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
      type: Object as PropType<echarts.EChartsCoreOption>,
      default: () => ({}),
    },
    onSuccess: {
      /**
       *
       * 返回 chart 实例
       *
       * 渲染成功回调函数
       *
       * () => ECharts
       */
      type: [Function, Array] as PropType<MaybeArray<(e: ECharts) => void>>,
      default: null,
    },
    onError: {
      /**
       *
       * 渲染失败回调函数
       *
       * () => void
       */
      type: [Function, Array] as PropType<MaybeArray<() => void>>,
      default: null,
    },
    theme: {
      type: [String, Object] as PropType<ChartTheme>,
      default: '',
    },
    autoChangeTheme: {
      /**
       *
       * 是否自动跟随模板主题切换
       * 如果开启此属性, 则会覆盖 `theme` 属性
       *
       * 注意: 这个属性重度依赖此模板
       */
      type: Boolean,
      default: true,
    },
    use: {
      /**
       *
       * 拓展 `echarts` 图表
       * 用于自己手动拓展相关的包
       */
      type: Array as PropType<EChartsExtensionInstallRegisters[]>,
      default: () => [],
    },
    watchOptions: {
      /** 主动监听 options 变化 */
      type: Boolean,
      default: true,
    },
    loading: {
      /** 加载动画 */
      type: Boolean,
      default: false,
    },
    loadingOptions: {
      /** 配置加载动画样式 */
      type: Object as PropType<LoadingOptions>,
      default: () => loadingOptions(),
    },
    observer: {
      /**
       *
       * 需要被监听尺寸的元素
       * 需要开启 autoResize 才能生效
       * 默认以父元素作为监听对象
       */
      type: Object as PropType<MaybeComputedElementRef<MaybeElement>>,
      default: null,
    },
    throttleWait: {
      /** 节流等待时间 */
      type: Number,
      default: 500,
    },
    animation: {
      /** 是否强制启用渲染动画 */
      type: Boolean,
      default: true,
    },
    setChartOptions: {
      /**
       *
       * 当 options 配置项更改时候，setOptions 方法配置项
       *
       * 默认值
       * notMerge: false,
       * lazyUpdate: true,
       * silent: false,
       * replaceMerge: [],
       *
       * 会自动进行合并配置项
       */
      type: Object as PropType<SetOptionOpts>,
      default: () => ({}),
    },
  },
  setup(props, { expose }) {
    const settingStore = useSetting()
    const { themeValue } = storeToRefs(settingStore)
    const rayChartRef = ref<HTMLElement>() // `echart` 容器实例
    const rayChartWrapperRef = ref<HTMLElement>()
    const echartInstanceRef = ref<ECharts>() // `echart` 实例
    let echartInstance: ECharts | null // `echart` 拷贝实例, 解决直接使用响应式实例带来的问题
    let resizeThrottleReturn: DebouncedFunc<AnyFC> | null // resize 防抖方法实例
    let resizeOvserverReturn: UseResizeObserverReturn | null
    const { echartTheme } = APP_THEME

    const cssVarsRef = computed(() => {
      const cssVars = {
        '--ray-chart-width': completeSize(props.width),
        '--ray-chart-height': completeSize(props.height),
      }

      return cssVars
    })

    /**
     *
     * 注册 `echart` 组件, 图利, 渲染器等
     *
     * 会自动合并拓展 `echart` 组件
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
        PictorialBarChart,
      ]) // 注册类型

      echarts.use([LabelLayout, UniversalTransition]) // 注册布局, 过度效果

      // 如果业务场景中需要 `svg` 渲染器, 手动导入渲染器后使用该行代码即可(不过为了体积考虑, 移除了 SVG 渲染器)
      // echarts.use([props.canvasRender ? CanvasRenderer : SVGRenderer])
      echarts.use([CanvasRenderer]) // 注册渲染器

      try {
        echarts.use(props.use?.filter(Boolean))
      } catch (e) {
        console.error(
          'register chart Core error: wrong property and method passed in extend attribute',
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
    const combineChartOptions = (ops: EChartsCoreOption) => {
      let options = cloneDeep(ops)

      const assign = (opts: object) =>
        Object.assign(
          {
            animation: true,
          },
          options,
          opts,
        )

      if (props.showAria) {
        options = assign({
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
     * 直接使用响应式代理实例会出现诡异的问题, 例如 `legend` 点击时报错
     */
    const renderChart = (theme: ChartTheme = echartTheme) => {
      /** 获取 dom 容器 */
      const element = rayChartRef.value as HTMLElement
      /** 获取配置项 */
      const options = combineChartOptions(props.options)
      /** 获取 dom 容器实际宽高 */
      const { height, width } = element.getBoundingClientRect()
      const { onSuccess, onError } = props

      try {
        /** 注册主题 */
        setupChartTheme().forEach((curr) => {
          echarts.registerTheme(curr.name, curr.theme)
        })

        /** 注册 chart */
        echartInstance = echarts.init(element, theme, {
          /** 如果款度为 0, 则以 200px 填充 */
          width: width === 0 ? 200 : void 0,
          /** 如果高度为 0, 则以 200px 填充 */
          height: height === 0 ? 200 : void 0,
        })
        echartInstanceRef.value = echartInstance

        /** 设置 options 配置项 */
        options && echartInstance.setOption({})

        if (props.animation) {
          setTimeout(() => {
            options && echartInstance?.setOption(options)
          })
        }

        /** 渲染成功回调 */
        if (onSuccess) {
          call(onSuccess, echartInstance)
        }
      } catch (e) {
        /** 渲染失败回调 */
        if (onError) {
          call(onError)
        }

        console.error('RayChart render error: ', e)
      }
    }

    /**
     *
     * @param bool 渲染带有主题色的可视化图
     *
     * 区别自动跟随模板主题切换与指定主题切换
     */
    const renderThemeChart = (bool?: boolean) => {
      if (props.autoChangeTheme) {
        bool ? renderChart(`${echartTheme}-dark`) : renderChart()

        return
      }

      if (!props.theme) {
        renderChart()
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

    /** 重置 echarts 尺寸 */
    const resizeChart = () => {
      if (echartInstance) {
        echartInstance.resize()
      }
    }

    const mount = () => {
      // 避免重复渲染
      if (echartInstance?.getDom()) {
        console.warn(
          'RayChart mount: There is a chart instance already initialized on the dom. Execution was interrupted',
        )

        return
      }

      if (props.autoChangeTheme) {
        /** 注册 echarts */
        renderThemeChart(themeValue.value)
      } else {
        props.theme ? renderChart(`${echartTheme}-dark`) : renderChart()
      }

      /** 注册事件 */
      if (props.autoResize) {
        resizeThrottleReturn = throttle(resizeChart, props.throttleWait)
        /** 监听内容区域尺寸变化更新 chart */
        resizeOvserverReturn = useResizeObserver(
          props.observer || rayChartWrapperRef,
          resizeThrottleReturn,
        )

        on(window, 'resize', resizeThrottleReturn)
      }
    }

    const unmount = () => {
      /** 卸载 echarts */
      destroyChart()
      /** 卸载事件柄 */
      resizeThrottleReturn && off(window, 'resize', resizeThrottleReturn)
      /** 注销防抖 */
      resizeThrottleReturn?.cancel()
      /** 注销 observer 监听 */
      resizeOvserverReturn?.stop?.()
    }

    /** 监听全局主题变化, 然后重新渲染对应主题 echarts */
    watch(
      () => themeValue.value,
      (theme) => {
        /**
         *
         * Q: 为什么需要重新卸载再渲染
         * A: 因为 echarts 官方文档并未提供动态渲染方法
         * A: 虽然原型上有 setTheme 方法, 但是官方标记是仅限于在类 ECharts 中访问
         */
        if (props.autoChangeTheme) {
          destroyChart()

          renderThemeChart(theme)
        }
      },
    )

    /**
     *
     * 贴花跟随主题渲染
     *
     * 自动跟随模板主题或者指定主题皆可
     */
    watch(
      () => props.showAria,
      () => {
        destroyChart()

        if (props.autoChangeTheme || props.theme) {
          themeValue.value ? renderChart(`${echartTheme}-dark`) : renderChart()
        } else {
          renderChart()
        }
      },
    )

    /** 显示/隐藏加载动画 */
    watch(
      () => props.loading,
      (ndata) => {
        ndata
          ? echartInstance?.showLoading(props.loadingOptions)
          : echartInstance?.hideLoading()
      },
    )

    /** 监听 options 变化 */
    watch(
      () => props.options,
      (noptions) => {
        if (props.watchOptions) {
          /** 重新组合 options */
          const options = combineChartOptions(noptions)
          const setOpt = Object.assign({}, props.setChartOptions, {
            notMerge: false,
            lazyUpdate: true,
            silent: false,
            replaceMerge: [],
          })

          /** 如果 options 发生变动更新 echarts */
          echartInstance?.setOption(options, setOpt)
        }
      },
      {
        deep: true,
      },
    )

    expose({
      echart: echartInstanceRef,
      dispose: unmount,
      render: mount,
    })

    onBeforeMount(async () => {
      /** 注册 echarts 组件与渲染器 */
      await registerChartCore()
    })

    onMounted(() => {
      nextTick(() => {
        mount()
      })
    })

    onBeforeUnmount(() => {
      unmount()
    })

    return {
      rayChartRef,
      cssVarsRef,
      rayChartWrapperRef,
    }
  },
  render() {
    return (
      <div class="ray-chart" style={[this.cssVarsRef]} ref="rayChartWrapperRef">
        <div class="ray-chart__container" ref="rayChartRef"></div>
      </div>
    )
  },
})

export default RayChart
