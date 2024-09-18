import type { ECharts } from 'echarts/core'
import type { VoidFC } from '@/types'

/**
 *
 * @description
 * 获取 RChart 实例。
 * 让你能够便捷的调用相关的一些已封装方法。
 *
 * @warning
 * 值得注意的是，必须手动调用 register 方法，否则不能正常使用。
 * 在使用 相关 hooks 的时候，需要注意生命周期，确保 register 方法已经被调用与表格实例已经被初始化；
 * 不要在父组件 create 阶段就去调用 hook，如果需要，请使用 nextTick 包裹。
 *
 * @example
 * defineComponent({
 *   setup() {
 *     const [register, { ...Hooks }] = useChart()
 *
 *     return {
 *      register,
 *      ...Hooks,
 *     }
 *   },
 *   render() {
 *     const { register, ...Hooks } = this
 *
 *     return <RChart onRegister={register} />
 *   },
 * })
 */
const useChart = () => {
  let echartInst: ECharts
  let _dispose: VoidFC
  let _render: VoidFC

  /**
   *
   * @param inst echart instance
   *
   * @description
   * 注册当前 echart 实例，用于使用 useChart hook。
   */
  const register = (inst: ECharts, render: VoidFC, dispose: VoidFC) => {
    if (inst) {
      echartInst = inst
      _dispose = dispose
      _render = render
    }
  }

  /**
   *
   * @description
   * 获取当前 echart 实例。
   *
   * 如果未在调用前注册 onRegister 事件，则会抛出异常。
   *
   * @example
   * const [register, { getChartInstance }] = useChart()
   *
   * const inst = getChartInstance()
   */
  const getChartInstance = () => {
    if (!echartInst) {
      throw new Error(
        '[useChart]: echart instance is not ready yet. if you are using useChart, please make sure you have called register method in onRegister event.',
      )
    }

    return {
      dispose: _dispose,
      render: _render,
      echartInst,
    }
  }

  /**
   *
   * @description
   * chart 是否已经销毁。
   * 如果销毁则返回 true，否则返回 false。
   */
  const isDisposed = () => !!getChartInstance().echartInst?.isDisposed()

  /**
   *
   * @description
   * 销毁当前 chart 实例。
   */
  const dispose = () => getChartInstance().dispose.call(null)

  /**
   *
   * @description
   * 渲染当前 chart 实例。
   */
  const render = () => getChartInstance().render.call(null)

  return [
    register,
    {
      getChartInstance,
      isDisposed,
      dispose,
      render,
    },
  ] as const
}

export type UseChartReturn = ReturnType<typeof useChart>

export default useChart
