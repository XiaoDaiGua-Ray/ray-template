import { getAppEnvironment } from '@/utils'

import type { AppMenuOption } from '@/types'

/**
 *
 * @remark 校验当前路由是否显示
 *
 * 该方法进行校验时, sameLevel 的优先级最高
 * 如果你仅仅是希望校验是否满足权限, 应该使用另一个方法 validRole
 */
export const validMenuItemShow = (option: AppMenuOption) => {
  const { meta = {} } = option
  const { hidden, sameLevel, env } = meta
  const { MODE } = getAppEnvironment()

  // 如果该路由被标记为平级模式, 则会强制不显示在菜单中
  if (sameLevel) {
    return false
  }

  if (hidden) {
    return false
  }

  if (env && typeof env === 'string' && env !== MODE) {
    return false
  }

  if (env && Array.isArray(env) && !env.includes(MODE)) {
    return false
  }

  return true
}
