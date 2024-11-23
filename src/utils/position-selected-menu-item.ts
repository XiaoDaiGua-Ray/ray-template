import { LAYOUT_SIDER_REF } from '@/app-config'
import { useSiderScroll } from '@/hooks'
import { unrefElement } from '@/utils'
import { SIDER_BAR_LOGO } from '@/layout/components/Menu/components/SiderBarLogo'

// 菜单激活样式 class name
const MENU_ITEM_SELECTED = '.n-menu-item-content--selected'
// 菜单项 class name
const MENU_ITEM = '.n-menu-item'
// 折叠菜单激活样式 class name
const MENU_COLLAPSED_ITEM_SELECTED = '.n-menu-item-content--child-active'

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
  // 获取 Sider 元素
  const siderEl = unrefElement(LAYOUT_SIDER_REF as Ref<HTMLElement>)
  // 获取激活的菜单项元素
  const selectedEl =
    siderEl?.querySelector<HTMLElement>(MENU_ITEM_SELECTED) ||
    siderEl?.querySelector<HTMLElement>(MENU_COLLAPSED_ITEM_SELECTED)
  // 获取 Sider 栏 Logo 元素
  const siderBarLogoEl = unrefElement(SIDER_BAR_LOGO)
  // Sider 栏 Logo 高度
  let siderBarLogoHeight: number = 0
  // 获取菜单项元素
  const menuItemEl = siderEl?.querySelector<HTMLElement>(MENU_ITEM)

  // 获取 Sider 栏 Logo 高度
  if (siderBarLogoEl) {
    const { height } = siderBarLogoEl.getBoundingClientRect()

    siderBarLogoHeight = height
  }

  // 如果激活的菜单项元素和 Sider 元素存在，则滚动 Sider 栏
  if (selectedEl && siderEl) {
    // 获取元素相对于视口的位置信息
    const selectedRect = selectedEl.getBoundingClientRect()
    const siderRect = siderEl.getBoundingClientRect()

    // 检查 selectedEl 是否在 sider 的可视区域内
    const isInViewport =
      selectedRect.top >= siderRect.top + siderBarLogoHeight &&
      selectedRect.bottom <= siderRect.bottom

    // 如果不在可视区域内，才执行滚动
    if (!isInViewport) {
      // 获取 Sider 滚动条
      const siderScroll = useSiderScroll()
      // 获取 Sider 元素当前滚动条的位置
      const siderScrollTop = siderEl.scrollTop
      // 获取菜单项元素的 margin-top 值，如果菜单项元素不存在，则使用默认值 6（测试得出 6px 是最佳值）
      const menuItemMarginTop = menuItemEl
        ? parseInt(window.getComputedStyle(menuItemEl).marginTop)
        : 6

      siderScroll({
        // 滚动到激活的菜单项位置，减去 Sider 栏 Logo 高度和菜单项的 margin-top 值
        top:
          selectedRect.top -
          siderRect.top +
          siderScrollTop -
          siderBarLogoHeight -
          menuItemMarginTop,
        // 水平滚动到 0 位置
        left: 0,
        // 平滑滚动
        behavior: 'smooth',
      })
    }
  }
}
