import type { ActionOptions } from '@/components/RayTable/src/type'

export const setupSettingOptions = (options: ActionOptions[]) => {
  const arr = options.map((curr) => {
    if (curr.fixed) {
      curr.fixed === 'right'
        ? (curr.rightFixedActivated = true)
        : (curr.leftFixedActivated = true)
    }

    if (curr.resizable) {
      curr.resizeColumnActivated = true
    }

    return curr
  })

  return arr
}
