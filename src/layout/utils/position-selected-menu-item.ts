import { LAYOUT_SIDER_REF } from '@/app-config'
import { useSiderScroll } from '@/hooks/template/useSiderScroll'
import { unrefElement } from '@/utils/vue/unref-element'

// 菜单激活样式 class name
const MENU_ITEM_SELECTED = '.n-menu-item-content--selected'
// 折叠菜单激活样式 class name
const MENU_COLLAPSED_ITEM_SELECTED = '.n-menu-item-content--child-active'

/**
 *
 * @description
 * 仅在已渲染的激活项超出菜单可视区域时滚动；调用方负责展开父菜单并等待渲染。
 */
export const positionSelectedMenuItem = () => {
  const siderEl = unrefElement(LAYOUT_SIDER_REF as Ref<HTMLElement | null>)
  const scrollEl = siderEl?.querySelector<HTMLElement>(
    '.n-layout-scroll-container, .n-scrollbar-container',
  )
  const selectedEl =
    siderEl?.querySelector<HTMLElement>(MENU_ITEM_SELECTED) ||
    siderEl?.querySelector<HTMLElement>(MENU_COLLAPSED_ITEM_SELECTED)

  if (!selectedEl || !scrollEl) return

  const selectedRect = selectedEl.getBoundingClientRect()
  const scrollRect = scrollEl.getBoundingClientRect()

  if (
    selectedRect.top >= scrollRect.top &&
    selectedRect.bottom <= scrollRect.bottom
  )
    return

  const menuItemEl = selectedEl.closest('.n-menu-item')
  const marginTop = menuItemEl
    ? parseFloat(window.getComputedStyle(menuItemEl).marginTop) || 0
    : 0

  useSiderScroll()({
    top: scrollEl.scrollTop + selectedRect.top - scrollRect.top - marginTop,
    left: 0,
    behavior: 'smooth',
  })
}
