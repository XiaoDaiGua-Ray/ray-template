import { useMenuGetters } from '@/store'
import { isValueType } from '@/utils'
import { createMenuExtra } from '@/store/modules/menu/helper'

import type { AppMenuOption } from '@/types'
import type { AppMenuExtraOptions } from '@/router/type'

export type BadgeKey = string | AppMenuOption

let cachePreNormal: AppMenuOption | undefined = void 0

// 渲染 extra
const renderExtra = (
  option: AppMenuOption,
  assignExtra: AppMenuExtraOptions,
) => {
  const { show, ...params } = assignExtra

  option.meta.extra = Object.assign({}, option.meta.extra, {
    ...params,
    show: show,
  })
  option.extra = createMenuExtra(option)

  cachePreNormal = option
}

/**
 *
 * @param path1 待比较的路径1
 * @param path2 待比较的路径2
 *
 * @description
 * 判断两个路径是否相等，忽略最后的斜杠
 *
 * @example
 * equal('/a/', '/a') // true
 * equal('/a', '/a') // true
 */
const equal = (path1: string, path2: string) => {
  const path1End = path1.endsWith('/')
  const path2End = path2.endsWith('/')

  if (path1End && path2End) {
    return path1.slice(0, -1) === path2.slice(0, -1)
  }

  if (!path1End && !path2End) {
    return path1 === path2
  }

  return (
    path1 === path2 ||
    path1.slice(0, -1) === path2 ||
    path1 === path2.slice(0, -1)
  )
}

// 递归查找匹配的菜单项，缓存上一次的匹配项
const deep = (
  options: AppMenuOption[],
  target: string,
  fn: string,
  assignExtra: AppMenuExtraOptions,
) => {
  if (cachePreNormal && equal(cachePreNormal.fullPath, target)) {
    renderExtra(cachePreNormal, assignExtra)

    return cachePreNormal
  }

  for (const curr of options) {
    if (equal(curr.fullPath, target)) {
      renderExtra(curr, assignExtra)

      cachePreNormal = curr

      return curr
    }

    if (curr.children?.length) {
      deep(curr.children, target, fn, assignExtra)

      continue
    }
  }
}

// 匹配菜单项
const normalOption = (
  target: BadgeKey,
  fn: string,
  assignExtra: AppMenuExtraOptions,
) => {
  const { getMenuOptions } = useMenuGetters()

  if (typeof target === 'string') {
    deep(getMenuOptions.value, target, fn, assignExtra)
  } else if (isValueType<'object'>(target, 'Object')) {
    const { fullPath } = target

    deep(getMenuOptions.value, fullPath, fn, assignExtra)
  } else {
    console.warn(`[useBadge ${fn}]: target expect string or object.`)
  }
}

export function useBadge() {
  /**
   *
   * @param target 目标菜单 key 或者菜单项（AppMenuOption)
   *
   * @example
   * const { hidden } = useBadge()
   *
   * hidden('your key')
   * hidden({ ...AppMenuOption })
   */
  const hidden = (target: BadgeKey) => {
    normalOption(target, 'hidden', {
      show: false,
    })
  }

  /**
   *
   * @param target 目标菜单 key 或者菜单项（AppMenuOption)
   *
   * @example
   * const { show } = useBadge()
   *
   * show('your key')
   * show({ ...AppMenuOption })
   */
  const show = (target: BadgeKey) => {
    normalOption(target, 'show', {
      show: true,
    })
  }

  /**
   *
   * @param target 目标菜单 key 或者菜单项（AppMenuOption)
   * @param extraOption 菜单标记配置项
   *
   * @example
   * const { update } = useBadge()
   *
   * update('your key', { ...AppMenuExtraOptions })
   * update({ ...AppMenuOption }, { ...AppMenuExtraOptions })
   */
  const update = (target: BadgeKey, extraOption: AppMenuExtraOptions) => {
    normalOption(target, 'update', extraOption)
  }

  return {
    hidden,
    show,
    update,
  }
}

export type UseBadgeReturnType = ReturnType<typeof useBadge>
