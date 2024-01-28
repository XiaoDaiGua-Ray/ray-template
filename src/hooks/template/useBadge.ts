import { useMenuGetters } from '@/store'

export function useBadge() {
  const { getMenuOptions } = useMenuGetters()

  const hidden = () => {}

  const show = () => {}

  const toggle = () => {}

  const updateLabel = () => {}

  return {
    hidden,
    show,
    toggle,
    updateLabel,
  }
}

export type UseBadgeReturnType = ReturnType<typeof useBadge>
