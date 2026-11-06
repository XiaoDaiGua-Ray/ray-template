import type { FlowOptions } from './types'

/**
 *
 * @description
 * RFlow 默认初始化流程图配置项。
 * 默认，使用组件内置的 container，所以会自动忽略该属性，即使是传递了。
 *
 * @returns 当前实例独立的初始化配置及嵌套键盘选项
 */
export const getDefaultFlowOptions = (): FlowOptions => {
  return {
    grid: true,
    partial: false,
    keyboard: {
      enabled: true,
    },
  }
}
