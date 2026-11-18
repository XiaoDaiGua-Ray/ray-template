import type { CustomDirectiveFC } from '../../types'

const updateElementDisabledType = (el: HTMLElement, value: boolean) => {
  const nativeControl = el.matches(
    'button, input, select, textarea, fieldset, optgroup, option',
  )

  el.toggleAttribute(nativeControl ? 'disabled' : 'inert', value)
  el.classList.toggle('r-template__directive--disabled', value)
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
