/**
 *
 * @param event 横向标签或单选项上的键盘事件
 * @param trigger 组件用于选中选项的原生事件
 *
 * @description
 * 在同组选项间循环移动焦点，复用鼠标选择路径以保留禁用状态及切换前校验。
 */
export function navigateHorizontalChoice(
  event: KeyboardEvent,
  trigger = 'click',
) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
    return

  const current = event.currentTarget as HTMLElement
  const group = current.closest('[role="tablist"], [role="radiogroup"]')
  const role = current.getAttribute('role')

  if (!group || (role !== 'tab' && role !== 'radio')) return

  const choices = Array.from(
    group.querySelectorAll<HTMLElement>(
      `[role="${role}"]:not([aria-disabled="true"])`,
    ),
  )
  const index = choices.indexOf(current)

  if (index < 0) return

  let target: HTMLElement

  switch (event.key) {
    case 'Home':
      target = choices[0]
      break
    case 'End':
      target = choices[choices.length - 1]
      break
    case 'ArrowLeft':
    case 'ArrowRight': {
      const forward =
        (event.key === 'ArrowRight') !==
        (getComputedStyle(current).direction === 'rtl')

      target =
        choices[(index + (forward ? 1 : choices.length - 1)) % choices.length]
      break
    }
    case ' ':
    case 'Enter':
      target = current
      break
    default:
      return
  }

  event.preventDefault()
  target.focus()

  if (trigger === 'hover') target.dispatchEvent(new MouseEvent('mouseenter'))
  else target.click()
}
