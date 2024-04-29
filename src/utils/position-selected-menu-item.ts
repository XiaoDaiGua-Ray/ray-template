import { LAYOUT_SIDER_REF } from '@/app-config'
import { useSiderScroll } from '@/hooks'
import { unrefElement } from '@/utils'
import { SIDER_BAR_LOGO } from '@/layout/components/Menu/components/SiderBarLogo'

const MENU_ITEM_SELECTED = '.n-menu-item-content--selected' // 菜单激活样式 class name
const MENU_ITEM = 'n-menu-item'

/**
 *
 * @description
 * 将 Sider 滚动条滚动到当前激活菜单项的位置。
 *
 * 但是，该方法目前存在一个问题，由于 NMenu 的渲染机制，默认不会渲染子菜单；
 * 所以导致一个问题，则是不能准确的获取到激活菜单项的元素。
 *
 * 有考虑过使用 setTimeout 来延迟执行，但是该渲染受到机器配置的影响，不是一个稳定的解决方案。
 *
 * @example
 * positionSelectedMenuItem() // 滚动到当前激活菜单项的位置
 */
export const positionSelectedMenuItem = () => {
  const siderEl = unrefElement(LAYOUT_SIDER_REF as Ref<HTMLElement>)
  const selectedEl = siderEl?.querySelector<HTMLElement>(MENU_ITEM_SELECTED)
  const siderBarLogoEl = unrefElement(SIDER_BAR_LOGO)
  let siderBarLogoHeight: number = 0
  const menuItemEl = siderEl?.querySelector<HTMLElement>(MENU_ITEM)

  if (siderBarLogoEl) {
    const { height } = siderBarLogoEl.getBoundingClientRect()

    siderBarLogoHeight = height
  }

  if (selectedEl && siderEl) {
    const siderScroll = useSiderScroll()
    const { top: siderTop } = siderEl.getBoundingClientRect()
    const { top: selectedTop } = selectedEl.getBoundingClientRect()
    const siderScrollTop = siderEl.scrollTop
    const menuItemMarginTop = menuItemEl
      ? parseInt(window.getComputedStyle(menuItemEl).marginTop)
      : 6

    siderScroll({
      top:
        selectedTop -
        siderTop +
        siderScrollTop -
        siderBarLogoHeight -
        menuItemMarginTop,
      left: 0,
      behavior: 'smooth',
    })
  }
}
