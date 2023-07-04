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
 *
 * 使用该方法时候, 可能会出现热更新错误的问题... 所以遇到的时候不要紧张, 刷新一下就好
 * 如果确定使用环境就在 setup 中, 还是建议使用官方的 useRouter useRoute 方法, 避免热更新报错的问题
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
