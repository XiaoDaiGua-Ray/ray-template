import type { MaybeArray } from '@ray-template/utils/types'
import type { MenuInst, MenuOption, MenuProps } from 'naive-ui'
import { shallowReactive, shallowRef } from 'vue'
import { call } from './vue/call'

type MenuKey = NonNullable<MenuProps['value']>
type ExpandedKeys = NonNullable<MenuProps['expandedKeys']>
type ValueListener = (key: MenuKey, option: MenuOption) => void
type ExpandedKeysListener = (keys: ExpandedKeys) => void

export interface UseMenuOptions extends Omit<
  MenuProps,
  | 'onUpdateValue'
  | 'onUpdate:value'
  | 'onUpdateExpandedKeys'
  | 'onUpdate:expandedKeys'
> {
  onUpdateValue?: MaybeArray<ValueListener>
  'onUpdate:value'?: MaybeArray<ValueListener>
  onUpdateExpandedKeys?: MaybeArray<ExpandedKeysListener>
  'onUpdate:expandedKeys'?: MaybeArray<ExpandedKeysListener>
}

/**
 *
 * @param options NMenu 的初始配置与更新回调
 *
 * @description
 * 仅同步显式控制的选中值和展开项；省略对应字段时由 NMenu 应用其默认配置。
 *
 * @returns 菜单实例引用、浅响应式属性和实例方法。
 */
export function useMenu(options: UseMenuOptions = {}) {
  const {
    onUpdateValue,
    'onUpdate:value': onValueUpdate,
    onUpdateExpandedKeys,
    'onUpdate:expandedKeys': onExpandedKeysUpdate,
    ...props
  } = options
  const menuRef = shallowRef<MenuInst | null>(null)
  const menuProps = shallowReactive({
    ...props,
    onUpdateValue(key: MenuKey, option: MenuOption) {
      if (menuProps.value !== void 0) menuProps.value = key

      if (onUpdateValue) call(onUpdateValue, key, option)

      if (onValueUpdate) call(onValueUpdate, key, option)
    },
    onUpdateExpandedKeys(keys: ExpandedKeys) {
      if (menuProps.expandedKeys !== void 0) menuProps.expandedKeys = keys

      if (onExpandedKeysUpdate) call(onExpandedKeysUpdate, keys)

      if (onUpdateExpandedKeys) call(onUpdateExpandedKeys, keys)
    },
  })

  const showOption: MenuInst['showOption'] = (key) =>
    menuRef.value?.showOption(key)
  const deriveResponsiveState: MenuInst['deriveResponsiveState'] = () =>
    menuRef.value?.deriveResponsiveState()

  return { menuRef, menuProps, showOption, deriveResponsiveState }
}

export type UseMenuReturn = ReturnType<typeof useMenu>
