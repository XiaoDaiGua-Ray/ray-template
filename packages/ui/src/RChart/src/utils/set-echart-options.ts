/**
 *
 * @description
 * 获取 setOptions 方法默认配置规则。
 *
 * @returns 每次独立创建的 ECharts 更新配置
 *
 * @see https://echarts.apache.org/zh/api.html#echartsInstance.setOption
 */
export const setEchartOptions = () => ({
  notMerge: true,
  lazyUpdate: true,
  silent: false,
  replaceMerge: [],
})
