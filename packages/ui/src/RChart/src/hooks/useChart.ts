import type { VoidFC } from '@ray-template/utils/types'
import type { ECharts } from 'echarts/core'

/**
 *
 * @description
 * 通过 RChart 的 onRegister 取得实例及组件拥有的重建、销毁方法。
 * 手动销毁后仍可通过 render 重建；真正的资源释放由组件负责。
 *
 * @returns 注册函数与实例访问、销毁、重建方法
 */
const useChart = () => {
  let echartInst: ECharts
  let _dispose: VoidFC
  let _render: VoidFC

  /**
   *
   * @param inst 当前 ECharts 实例
   * @param render 由组件提供的重建入口
   * @param dispose 由组件提供的销毁入口
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
   * @returns 实例及组件拥有的重建、销毁方法
   * @throws 尚未通过 onRegister 注册时抛错
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
   *
   * @returns 最近注册的图表是否已销毁
   * @throws 尚未注册时抛错
   */
  const isDisposed = () => !!getChartInstance().echartInst?.isDisposed()

  /**
   *
   * @description
   * 销毁当前 chart 实例。
   *
   * @throws 尚未注册时抛错
   */
  const dispose = () => getChartInstance().dispose.call(null)

  /**
   *
   * @description
   * 渲染当前 chart 实例。
   *
   * @throws 尚未注册时抛错
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
