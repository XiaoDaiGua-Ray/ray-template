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
import { NCard } from 'naive-ui'

import props from './props'
import { useSetting } from '@/store'
import { throttle } from 'lodash-es'
import { completeSize } from '@/utils/element'
import { call } from '@/utils/vue/index'
import { setupChartTheme } from './helper'
import { APP_THEME } from '@/app-config/designConfig'
import { useResizeObserver } from '@vueuse/core'
import RMoreDropdown from '@/components/RMoreDropdown/index'
import { renderNode } from '@use-utils/vue/index'
import { downloadBase64File } from '@use-utils/basic'

import type { WatchStopHandle } from 'vue'
import type { AnyFC } from '@/types/modules/utils'
import type { DebouncedFunc } from 'lodash-es'
import type { UseResizeObserverReturn } from '@vueuse/core'
import type { ECharts, EChartsCoreOption } from 'echarts/core'
import type { DropdownProps, DropdownOption } from 'naive-ui'

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
    const { themeValue: currentTheme } = storeToRefs(settingStore)
    const rayChartRef = ref<HTMLElement>() // echart 容器实例
    const rayChartWrapperRef = ref<HTMLElement>()
    const echartInstanceRef = ref<ECharts>() // echart 实例
    let resizeThrottleReturn: DebouncedFunc<AnyFC> | null // resize 防抖方法实例
    let resizeObserverReturn: UseResizeObserverReturn | null
    const { echartTheme } = APP_THEME
    let watchCallback: WatchStopHandle | null
    let echartInst: ECharts | null // 无代理响应式代理缓存 echart inst
    const moreDropDownOptions = computed<DropdownProps['options']>(() => [
      {
        label: '下载图片',
        key: 'downloadChart',
        disabled: !(
          echartInstanceRef.value && echartInstanceRef.value.getDom()
        ),
      },
    ])
    const cssVarsRef = computed(() => {
      return {
        '--ray-chart-width': completeSize(props.width),
        '--ray-chart-height': completeSize(props.height),
      }
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
     * 更具当前主题渲染 chart
     *
     * 如果手动配置了 theme 属性，autoChangeTheme 属性则会失效
     * 但是，如果配置 theme 属性为 default，则会根据当前主题色渲染 chart 默认主题
     *
     * 当 Boolean(theme) 为 false，则会尝试获取 echartTheme 属性
     * 但是，如果未获取到 echartTheme 属性，则会使用默认样式
     */
    const updateChartTheme = () => {
      if (props.theme === 'default') {
        props.autoChangeTheme ? renderChart('dark') : renderChart('')

        return
      }

      if (!props.theme) {
        const theme = props.autoChangeTheme
          ? currentTheme.value
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
     * @returns `chart options`
     *
     * 合并配置项
     * 如果有需要特殊全局配置的可以在此继续写...
     */
    const combineChartOptions = (ops: EChartsCoreOption) => {
      let options = unref(ops)

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
    const renderChart = (theme: string = echartTheme) => {
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
        echartInst = echarts.init(element, theme, {
          /** 如果款度为 0, 则以 200px 填充 */
          width: width === 0 ? 200 : void 0,
          /** 如果高度为 0, 则以 200px 填充 */
          height: height === 0 ? 200 : void 0,
        })
        echartInstanceRef.value = echartInst

        /** 设置 options 配置项 */
        if (props.animation) {
          echartInst.setOption({})

          setTimeout(() => {
            options && echartInst?.setOption(options)
          })
        } else {
          options && echartInst?.setOption(options)
        }

        /** 渲染成功回调 */
        if (onSuccess) {
          call(onSuccess, echartInst)
        }
      } catch (e) {
        /** 渲染失败回调 */
        if (onError) {
          call(onError)
        }

        console.error('RChart render error: ', e)
      }
    }

    const isDispose = () => !!(echartInst && echartInst.getDom())

    /**
     *
     * 销毁 `chart` 实例, 释放资源
     */
    const destroyChart = () => {
      if (isDispose()) {
        echartInst!.clear()
        echartInst!.dispose()
        echartInstanceRef.value = void 0
      }
    }

    /** 重置 echarts 尺寸 */
    const resizeChart = () => {
      if (echartInst) {
        echartInst.resize()
      }
    }

    const dropdownSelect = (key: string | number, option: DropdownOption) => {
      if (key === 'downloadChart' && isDispose()) {
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
      // 避免重复渲染
      if (echartInst?.getDom()) {
        console.warn(
          'RChart mount: There is a chart instance already initialized on the dom. Execution was interrupted',
        )

        return
      }

      updateChartTheme()

      /** 注册事件 */
      if (props.autoResize) {
        resizeThrottleReturn = throttle(resizeChart, props.throttleWait)
        /** 监听内容区域尺寸变化更新 chart */

        resizeObserverReturn = useResizeObserver(
          props.observer || rayChartWrapperRef,
          resizeThrottleReturn,
        )
      }
    }

    const unmount = () => {
      /** 卸载 echarts */
      destroyChart()
      /** 注销防抖 */
      resizeThrottleReturn?.cancel()
      /** 注销 observer 监听 */
      resizeObserverReturn?.stop?.()
    }

    /** 监听全局主题变化, 然后重新渲染对应主题 echarts */
    watch(
      () => currentTheme.value,
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
        watchCallback = watch(
          () => props.options,
          (ndata) => {
            /** 重新组合 options */
            const options = combineChartOptions(ndata)
            const setOpt = Object.assign(
              props.setChartOptions,
              defaultChartOptions,
            )
            /** 如果 options 发生变动更新 echarts */
            echartInst?.setOption(options, setOpt)
          },
          {
            deep: true,
          },
        )
      } else {
        watchCallback?.()
      }

      props.loading
        ? echartInst?.showLoading(props.loadingOptions)
        : echartInst?.hideLoading()
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
      mount()
    })
    onBeforeUnmount(() => {
      unmount()
      watchCallback?.()
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
