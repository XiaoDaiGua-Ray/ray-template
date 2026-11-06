import { printDom as print } from '@ray-template/composables/dom'
import type { PrintDomOptions } from '@ray-template/composables/dom'
import type { BasicTarget } from '@ray-template/composables/types'

export type { PrintDomOptions }

/**
 *
 * @param target 截图目标，执行时解析元素
 * @param options 截图与打印配置
 *
 * @description
 * 使用应用全局加载条反馈截图和打印状态，覆盖 options.loading。
 *
 * @returns 已提交打印预览时为 true；失败时记录错误并返回 false。
 */
export const printDom = <T extends HTMLElement>(
  target: BasicTarget<T>,
  options?: PrintDomOptions<T>,
) => print(target, { ...options, loading: window.$loadingBar })
