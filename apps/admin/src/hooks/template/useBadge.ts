import type { AppMenuExtraOptions } from '@/router/types'
import { depthSearchAppMenu, useMenuGetters } from '@/store'
import { createMenuExtra } from '@/store/modules/menu/utils'
import type { AppMenuOption } from '@/types'

export type BadgeKey = string | AppMenuOption

/**
 *
 * @param target 菜单路径或菜单项
 * @param extra 合并到当前菜单的标记配置
 *
 * @description
 * 通过已加载的菜单树定位真实对象，并重建其标记渲染入口，避免只更新传入的副本。
 */
const updateBadge = (target: BadgeKey, extra: AppMenuExtraOptions) => {
  const { getMenuOptions } = useMenuGetters()
  const key = typeof target === 'string' ? target : target?.fullPath

  if (!key) {
    console.warn('[useBadge]: Expected a menu path or menu option.')

    return
  }

  const option = depthSearchAppMenu(getMenuOptions.value, key)

  if (!option) return

  option.meta.extra = { ...option.meta.extra, ...extra }
  option.extra = createMenuExtra(option)
}

/**
 *
 * @returns 按菜单路径查找并修改共享标记的方法；未加载的菜单不会被创建。
 */
export function useBadge() {
  /**
   *
   * @param target 菜单路径或菜单项
   *
   * @description
   * 隐藏标记并保留其余配置。
   */
  const hidden = (target: BadgeKey) => {
    updateBadge(target, {
      show: false,
    })
  }

  /**
   *
   * @param target 菜单路径或菜单项
   * @param extraOption 显示时合并的标记配置
   *
   * @description
   * 显示标记，强制启用 show。
   */
  const show = (
    target: BadgeKey,
    extraOption?: Omit<AppMenuExtraOptions, 'show'>,
  ) => {
    updateBadge(target, {
      ...extraOption,
      show: true,
    })
  }

  /**
   *
   * @param target 菜单路径或菜单项
   * @param extraOption 要合并的标记配置
   *
   * @description
   * 局部更新标记，未指定的字段保留原值。
   */
  const update = (target: BadgeKey, extraOption: AppMenuExtraOptions) => {
    updateBadge(target, extraOption)
  }

  return {
    hidden,
    show,
    update,
  }
}

export type UseBadgeReturnType = ReturnType<typeof useBadge>
