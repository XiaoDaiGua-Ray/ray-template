import './index.scss'

import { use, registerTheme, init } from 'echarts/core' // echarts 核心模块
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  AriaComponent,
} from 'echarts/components' // 提示框, 标题, 直角坐标系, 数据集, 内置数据转换器等组件(组件后缀都为 Component)
import {
  BarChart,
  LineChart,
  PieChart,
  CandlestickChart,
  ScatterChart,
  PictorialBarChart,
} from 'echarts/charts' // 系列类型(后缀都为 SeriesOption)
import { LabelLayout, UniversalTransition } from 'echarts/features' // 标签自动布局, 全局过渡动画等特性
import { CanvasRenderer } from 'echarts/renderers' // echarts 渲染器
import { NCard } from 'naive-ui'

import props from './props'
import { throttle } from 'lodash-es'
import { completeSize, downloadBase64File, call, renderNode } from '@/utils'
import { setupChartTheme } from './utils'
import { APP_THEME } from '@/app-config'
import {
  useResizeObserver,
  useIntersectionObserver,
  watchThrottled,
} from '@vueuse/core'
import { RMoreDropdown } from '@/components'
import { useSettingGetters } from '@/store'

import type { WatchStopHandle } from 'vue'
import type { AnyFC } from '@/types'
import type { DebouncedFunc } from 'lodash-es'
import type {
  UseResizeObserverReturn,
  UseIntersectionObserverReturn,
} from '@vueuse/core'
import type { ECharts, EChartsCoreOption } from 'echarts/core'
import type { DropdownProps, DropdownOption } from 'naive-ui'

// setOption 默认配置项
const defaultChartOptions = {
  notMerge: false,
  lazyUpdate: true,
  silent: false,
  replaceMerge: [],
}
// 获取 chart 主题
const echartThemes = setupChartTheme()
// download 下载功能 key
const __CHART_DOWN_LOAD_CHART__ = '__R_CHART_DOWN_LOAD_CHART__'

// 注册主题
echartThemes.forEach((curr) => {
  registerTheme(curr.name, curr.theme)
})

/**
 *
 * @description
 * 基于 echarts 的图表组件。
 *
 * 让你仅需要关注 echarts options 的配置管理，而不需要关心 echarts 的初始化、销毁、主题切换等操作。
 *
 * 如果需要拓展配置项，进需要在使用该组件的时候使用 use 方法注册对应 chart 组件即可。
 *
 * @example
 * <template>
 *  <RChart :options="options" @register="register" />
 * </template>
 *
 * <script setup>
 * import { RChart } from '@/components'
 *
 * import { useChart } from 'vue'
 * import { ref } from 'vue'
 *
 * const [register, { ...Hooks }] = useChart()
 * const options = ref({ ... })
 * </script>
 */
export default defineComponent({
  name: 'RChart',
  props,
  setup(props, { expose }) {
    const { getAppTheme } = useSettingGetters()
    const rayChartRef = ref<HTMLElement>() // echart 容器实例
    const rayChartWrapperRef = ref<HTMLElement>() // echart 父容器实例
    const echartInstanceRef = ref<ECharts>() // echart 实例
    let resizeThrottleReturn: DebouncedFunc<AnyFC> | null // resize 防抖方法实例
    let resizeObserverReturn: UseResizeObserverReturn | null // resize observer 实例
    const { echartTheme } = APP_THEME // 当前配置主题
    let watchThrottledCallback: WatchStopHandle | null // watch props 回调
    let echartInst: ECharts | null // 无代理响应式代理缓存 echart inst
    const moreDropDownOptions = computed<DropdownProps['options']>(() => [
      {
        label: '下载图片',
        key: __CHART_DOWN_LOAD_CHART__,
        disabled: !(
          echartInstanceRef.value && echartInstanceRef.value.getDom()
        ),
      },
    ]) // 下拉框配置项
    const cssVarsRef = computed(() => {
      return {
        '--ray-chart-width': completeSize(props.width),
        '--ray-chart-height': completeSize(props.height),
      }
    })
    const targetIsVisible = ref(false) // 目标是否可见
    let intersectionObserverReturn: UseIntersectionObserverReturn | null // intersectionObserver 实例

    /**
     *
     * 注册 `echart` 组件, 图利, 渲染器等
     *
     * 会自动合并拓展 `echart` 组件
     * 该方法必须在注册图表之前调用
     */
    const registerChartCore = async () => {
      use([
        TitleComponent,
        TooltipComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent,
        LegendComponent,
        ToolboxComponent,
        AriaComponent,
      ]) // 注册组件
      use([
        BarChart,
        LineChart,
        PieChart,
        CandlestickChart,
        ScatterChart,
        PictorialBarChart,
      ]) // 注册 chart series type
      use([LabelLayout, UniversalTransition]) // 注册布局, 过度效果
      use([CanvasRenderer]) // 注册渲染器

      try {
        use(props.use?.filter(Boolean))
      } catch (e) {
        console.error('[RChart register error]: ', e)
      }
    }

    /**
     *
     * 更具当前主题渲染 chart
     *
     * 如果手动配置了 theme 属性，autoChangeTheme 属性则会失效
     * 但是，如果配置 theme 属性为 default，则会根据当前主题色渲染 chart 默认主题
     *
     * 当 Boolean(theme) 为 false，则会尝试获取 echartTheme 属性
     * 但是，如果未获取到 echartTheme 属性，则会使用默认样式
     */
    const updateChartTheme = () => {
      if (echartInst?.getDom()) {
        destroyChart()
      }

      if (props.theme === 'default') {
        props.autoChangeTheme ? renderChart('dark') : renderChart('')

        return
      }

      if (!props.theme) {
        const theme = props.autoChangeTheme
          ? getAppTheme.value
            ? `${echartTheme}-dark`
            : echartTheme
          : echartTheme

        renderChart(theme)
      } else {
        renderChart(props.theme)
      }
    }

    /**
     *
     * @param ops 待合并 chart options
     *
     * @description
     * 合并 chart options。
     *
     * 如果启用了 showAria 则会自动合并 aria 配置项。
     */
    const combineChartOptions = (ops: EChartsCoreOption) => {
      let options = unref(ops)

      const assign = (opts: object) => Object.assign({}, options, opts)

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
    const renderChart = (theme: string = echartTheme) => {
      /** 获取 dom 容器 */
      const element = rayChartRef.value as HTMLElement
      /** 获取配置项 */
      const options = combineChartOptions(props.options)
      /** 获取 dom 容器实际宽高 */
      const { height, width } = element.getBoundingClientRect()
      const { onSuccess, onError } = props

      try {
        /** 注册 chart */
        echartInst = init(element, theme, {
          /** 如果款度为 0, 则以 200px 填充 */
          width: width === 0 ? 200 : void 0,
          /** 如果高度为 0, 则以 200px 填充 */
          height: height === 0 ? 200 : void 0,
        })
        echartInstanceRef.value = echartInst

        // 渲染成功回调
        if (onSuccess) {
          call(onSuccess, echartInst)
        }

        // 是否强制下一队列渲染图表
        if (props.nextTick) {
          echartInst.setOption({})

          nextTick(() => {
            options && echartInst?.setOption(options)
          })
        } else {
          options && echartInst?.setOption(options)
        }
      } catch (e) {
        /** 渲染失败回调 */
        if (onError) {
          call(onError)
        }

        throw new Error(`[RChart render error]: ${e}`)
      } finally {
        const { onFinally } = props

        if (onFinally) {
          call(onFinally)
        }
      }
    }

    /**
     *
     * @description
     * chart 是否已经销毁。
     * 如果销毁则返回 true, 否则返回 false。
     */
    const isDispose = () => !(echartInst && echartInst.getDom())

    /**
     *
     * 销毁 chart 实例, 释放资源
     */
    const destroyChart = () => {
      if (!isDispose()) {
        echartInst!.clear()
        echartInst!.dispose()

        echartInstanceRef.value = void 0
        echartInst = null
      }
    }

    /** 重置 echarts 尺寸 */
    const resizeChart = () => {
      if (echartInst) {
        echartInst.resize()
      }
    }

    /**
     *
     * @param key moreDropDownOptions key
     * @param option moreDropDownOptions current click option
     *
     * 预设 card 风格下拉框点击
     * 当前仅实现下载图片功能
     */
    const dropdownSelect = (key: string | number, option: DropdownOption) => {
      if (key === __CHART_DOWN_LOAD_CHART__ && !isDispose()) {
        const { filename, ...args } = props.downloadOptions

        downloadBase64File(
          echartInst!.getDataURL(args),
          filename ?? `${new Date().getTime()}`,
        )
      }

      const { onDropdownSelect } = props

      if (onDropdownSelect) {
        call(onDropdownSelect, key, option)
      }
    }

    const mount = () => {
      // 注册事件
      if (props.autoResize) {
        if (!resizeThrottleReturn) {
          resizeThrottleReturn = throttle(resizeChart, 500)
        }

        /**
         *
         * 监听内容区域尺寸变化更新 chart。
         * 如果没有传入 autoResizeObserverTarget 属性，则默认监听容器尺寸变化。
         */
        if (!resizeObserverReturn) {
          resizeObserverReturn = useResizeObserver(
            props.autoResizeObserverTarget || rayChartWrapperRef,
            resizeThrottleReturn as AnyFC,
          )
        }
      }

      // 避免重复渲染
      if (echartInst?.getDom()) {
        return
      }

      // 如果目标不可见并且启用了 intersectionObserver 则不渲染
      if (!targetIsVisible.value && props.intersectionObserver) {
        return
      }

      // 渲染 chart
      updateChartTheme()

      // 初始化完成后移除 intersectionObserver 监听
      intersectionObserverReturn?.stop()

      // 注册 register，用于 useChart hook
      const { onRegister } = props

      if (onRegister && echartInst) {
        call(onRegister, echartInst, mount, unmount)
      }
    }

    if (props.intersectionObserver) {
      intersectionObserverReturn = useIntersectionObserver(
        props.intersectionObserverTarget || rayChartWrapperRef,
        ([entry]) => {
          targetIsVisible.value = entry.isIntersecting
        },
        props.intersectionOptions,
      )
    }

    const unmount = () => {
      // 卸载 echarts
      destroyChart()
      // 注销防抖
      resizeThrottleReturn?.cancel()
      // 注销 observer 监听
      resizeObserverReturn?.stop()
      intersectionObserverReturn?.stop()

      intersectionObserverReturn = null
      resizeThrottleReturn = null
      resizeObserverReturn = null
    }

    /** 监听全局主题变化, 然后重新渲染对应主题 echarts */
    watch(
      () => getAppTheme.value,
      () => {
        /**
         *
         * Q: 为什么需要重新卸载再渲染
         * A: 因为 echarts 官方文档并未提供动态渲染方法
         * A: 虽然原型上有 setTheme 方法, 但是官方标记是仅限于在类 ECharts 中访问
         */
        if (props.autoChangeTheme) {
          destroyChart()
          updateChartTheme()
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
        updateChartTheme()
      },
    )
    watchEffect(() => {
      /** 监听 options 变化 */
      if (props.watchOptions) {
        watchThrottledCallback = watchThrottled(
          () => props.options,
          (ndata) => {
            // 重新组合 options
            const options = combineChartOptions(ndata)
            const setOpt = Object.assign(
              {},
              props.setChartOptions,
              defaultChartOptions,
            )
            // 如果 options 发生变动更新 echarts
            echartInst?.setOption(options, setOpt)
          },
          {
            // 深度监听 options
            deep: true,
            throttle: props.watchOptionsThrottleWait,
          },
        )
      } else {
        watchThrottledCallback?.()
      }

      // 监听 loading 变化
      props.loading
        ? echartInst?.showLoading(props.loadingOptions)
        : echartInst?.hideLoading()

      // 当前图表容器是否处于可见状态，如果可见则渲染图表
      if (targetIsVisible.value) {
        mount()
      }
    })

    expose()

    onBeforeMount(async () => {
      // 注册 echarts 组件与渲染器
      await registerChartCore()
    })
    onMounted(() => {
      // 初始化渲染
      mount()
    })
    onBeforeUnmount(() => {
      unmount()
      watchThrottledCallback?.()
    })

    return {
      rayChartRef,
      cssVarsRef,
      rayChartWrapperRef,
      moreDropDownOptions,
      dropdownSelect,
    }
  },
  render() {
    const {
      title,
      contentStyle,
      preset,
      moreDropDownOptions,
      dropdownSelect,
      bordered,
      dropdownOptions,
    } = this
    const { cardExtra } = this.$slots

    return preset === 'card' ? (
      <NCard
        class="ray-chart"
        ref="rayChartWrapperRef"
        style={[this.cssVarsRef]}
        contentStyle={contentStyle}
        bordered={bordered}
      >
        {{
          default: renderNode(
            <div class="ray-chart__container" ref="rayChartRef"></div>,
          ),
          header: renderNode(title, {
            defaultElement: <div style="display: none;"></div>,
          }),
          'header-extra': renderNode(cardExtra, {
            defaultElement: (
              <RMoreDropdown
                iconSize={18}
                cursor="pointer"
                options={dropdownOptions ?? moreDropDownOptions}
                trigger="click"
                onSelect={dropdownSelect.bind(this)}
                placement="bottom-end"
              />
            ),
          }),
        }}
      </NCard>
    ) : (
      <div class="ray-chart" style={[this.cssVarsRef]} ref="rayChartWrapperRef">
        <div class="ray-chart__container" ref="rayChartRef"></div>
      </div>
    )
  },
})
