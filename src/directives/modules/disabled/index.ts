import type { CustomDirectiveFC } from '@/directives/types'
import { removeClass, setClass } from '@/utils'

const updateElementDisabledType = (el: HTMLElement, value: boolean) => {
  if (el) {
    const classes = 'r-template__directive--disabled'

    if (value) {
      el.setAttribute('disabled', 'disabled')

      setClass(el, classes)
    } else {
      el.removeAttribute('disabled')

      removeClass(el, classes)
    }

    el?.setAttribute('disabled', value ? 'disabled' : '')
  }
}

const disabledDirective: CustomDirectiveFC<HTMLElement, boolean> = () => {
  return {
    mounted: (el, { value }) => {
      updateElementDisabledType(el, value)
    },
    updated: (el, { value, oldValue }) => {
      if (value === oldValue) {
        return
      }

      updateElementDisabledType(el, value)
    },
  }
}

export default disabledDirective
