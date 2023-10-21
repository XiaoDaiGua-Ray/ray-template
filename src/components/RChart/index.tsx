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
import { CanvasRenderer } from 'echarts/renderers' // `echarts` 渲染器

import props from './props'
import { useSetting } from '@/store'
import { cloneDeep, throttle } from 'lodash-es'
import { on, off, completeSize } from '@/utils/element'
import { call } from '@/utils/vue/index'
import { setupChartTheme } from './helper'
import { APP_THEME } from '@/app-config/designConfig'
import { useResizeObserver } from '@vueuse/core'

import type { WatchStopHandle } from 'vue'
import type { AnyFC } from '@/types/modules/utils'
import type { DebouncedFunc } from 'lodash-es'
import type { ChartTheme } from '@/components/RChart/type'
import type { UseResizeObserverReturn } from '@vueuse/core'
import type { ECharts, EChartsCoreOption } from 'echarts/core'

export type { RayChartInst, EChartsExtensionInstallRegisters } from './type'

const defaultChartOptions = {
  notMerge: false,
  lazyUpdate: true,
  silent: false,
  replaceMerge: [],
}
const echartThemes = setupChartTheme()

export default defineComponent({
  name: 'RChart',
  props,
  setup(props, { expose }) {
    const settingStore = useSetting()
    const { themeValue } = storeToRefs(settingStore)
    const rayChartRef = ref<HTMLElement>() // `echart` 容器实例
    const rayChartWrapperRef = ref<HTMLElement>()
    const echartInstanceRef = ref<ECharts>() // `echart` 实例
    let resizeThrottleReturn: DebouncedFunc<AnyFC> | null // resize 防抖方法实例
    let resizeOvserverReturn: UseResizeObserverReturn | null
    const { echartTheme } = APP_THEME
    let watchCallback: WatchStopHandle | null

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
      ]) // 注册 chart series type

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
      let options = cloneDeep(unref(ops))

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
        echartThemes.forEach((curr) => {
          echarts.registerTheme(curr.name, curr.theme)
        })

        /** 注册 chart */
        echartInstanceRef.value = echarts.init(element, theme, {
          /** 如果款度为 0, 则以 200px 填充 */
          width: width === 0 ? 200 : void 0,
          /** 如果高度为 0, 则以 200px 填充 */
          height: height === 0 ? 200 : void 0,
        })

        /** 设置 options 配置项 */
        echartInstanceRef.value.setOption({})

        if (props.animation) {
          setTimeout(() => {
            options && echartInstanceRef.value?.setOption(options)
          })
        }

        /** 渲染成功回调 */
        if (onSuccess) {
          call(onSuccess, echartInstanceRef.value)
        }
      } catch (e) {
        /** 渲染失败回调 */
        if (onError) {
          call(onError)
        }

        console.error('RChart render error: ', e)
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
      if (echartInstanceRef.value) {
        echartInstanceRef.value.clear()
        echartInstanceRef.value.dispose()
      }
    }

    /** 重置 echarts 尺寸 */
    const resizeChart = () => {
      if (echartInstanceRef.value) {
        echartInstanceRef.value.resize()
      }
    }

    const mount = () => {
      // 避免重复渲染
      if (echartInstanceRef.value?.getDom()) {
        console.warn(
          'RChart mount: There is a chart instance already initialized on the dom. Execution was interrupted',
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

    watchEffect(() => {
      /** 监听 options 变化 */
      if (props.watchOptions) {
        watchCallback = watch(
          () => props.options,
          (noptions) => {
            /** 重新组合 options */
            const options = combineChartOptions(noptions)
            const setOpt = Object.assign(
              props.setChartOptions,
              defaultChartOptions,
            )
            /** 如果 options 发生变动更新 echarts */
            echartInstanceRef.value?.setOption(options, setOpt)
          },
          {
            deep: true,
          },
        )
      } else {
        watchCallback?.()
      }

      props.loading
        ? echartInstanceRef.value?.showLoading(props.loadingOptions)
        : echartInstanceRef.value?.hideLoading()
    })

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
      watchCallback?.()
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
