import { useMenuGetters, depthSearchAppMenu } from '@/store'
import { isValueType } from '@/utils'
import { createMenuExtra } from '@/store/modules/menu/utils'

import type { AppMenuOption } from '@/types'
import type { AppMenuExtraOptions } from '@/router/types'

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

// 根据匹配的菜单项渲染 extra
const renderExtraWithNormalMenuOption = (
  options: AppMenuOption[],
  target: string,
  assignExtra: AppMenuExtraOptions,
) => {
  const menuOption = depthSearchAppMenu(options, target)

  if (menuOption) {
    renderExtra(menuOption, assignExtra)
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
    renderExtraWithNormalMenuOption(getMenuOptions.value, target, assignExtra)
  } else if (isValueType<'object'>(target, 'Object')) {
    const { fullPath } = target

    renderExtraWithNormalMenuOption(getMenuOptions.value, fullPath, assignExtra)
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
