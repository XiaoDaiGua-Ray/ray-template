/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { router } from '@/router/index'

/**
 *
 * @returns vue router instance
 *
 * @remark 使用 vue router instance, 可以在 setup 环境外使用
 */
export const useVueRouter = () => {
  try {
    if (router) {
      return {
        router,
      }
    } else {
      throw new Error()
    }
  } catch (e) {
    throw new Error('router is not defined')
  }
}
