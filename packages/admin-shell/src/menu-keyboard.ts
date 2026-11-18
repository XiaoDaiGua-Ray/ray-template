import type { MenuProps } from 'naive-ui'

export function useMenuKeyboard(horizontal: boolean, collapsed = () => false) {
  let popup: HTMLElement | undefined
  const dropdownProps: NonNullable<MenuProps['dropdownProps']> = {
    delay: 0,
    'onUpdate:show': (show: boolean) => {
      if (!show) popup = void 0
    },
  }
  const nodeProps: NonNullable<MenuProps['nodeProps']> = (option) => ({
    tabindex: option.disabled ? -1 : 0,
    'aria-haspopup':
      option.children?.length && (horizontal || collapsed()) ? 'menu' : void 0,
  })
  const onKeydown = (event: KeyboardEvent) => {
    const item = event.target
    const menu = event.currentTarget

    if (
      event.isComposing ||
      event.altKey ||
      event.metaKey ||
      event.ctrlKey ||
      !(menu instanceof HTMLElement) ||
      !(item instanceof HTMLElement) ||
      item.getAttribute('role') !== 'menuitem'
    )
      return

    const control = item.firstElementChild

    if (!(control instanceof HTMLElement)) return

    if (popup === item) {
      // 下拉层已打开，方向键、Enter、Escape 均由 Naive UI 处理。
      if (event.key === 'Tab')
        item.parentElement?.dispatchEvent(new MouseEvent('mouseleave'))

      return
    }

    const hasPopup = item.getAttribute('aria-haspopup') === 'menu'

    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      (hasPopup && event.key === 'ArrowDown')
    ) {
      event.preventDefault()
      event.stopPropagation()

      if (event.repeat) return

      if (hasPopup) {
        // NMenu 的折叠和横向子菜单共用 hover 浮层，沿用同一触发节点和键盘选项。
        popup = item
        item.parentElement?.dispatchEvent(new MouseEvent('mouseenter'))

        return
      }

      control.click()

      return
    }

    const group = item.parentElement

    if (
      !horizontal &&
      group?.hasAttribute('aria-expanded') &&
      (event.key === 'ArrowRight' || event.key === 'ArrowLeft')
    ) {
      if (
        (event.key === 'ArrowRight') !==
        (group.getAttribute('aria-expanded') === 'true')
      )
        control.click()

      event.preventDefault()

      return
    }

    const previous = horizontal ? 'ArrowLeft' : 'ArrowUp'
    const next = horizontal ? 'ArrowRight' : 'ArrowDown'

    if (![previous, next, 'Home', 'End'].includes(event.key)) return

    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"][tabindex="0"]'),
    ).filter(
      (node) => node.checkVisibility?.({ visibilityProperty: true }) !== false,
    )

    if (!items.length) return

    const index = items.indexOf(item)
    const target =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : (index + (event.key === previous ? -1 : 1) + items.length) %
            items.length

    event.preventDefault()
    items[target]?.focus()
  }

  return { nodeProps, dropdownProps, onKeydown }
}
