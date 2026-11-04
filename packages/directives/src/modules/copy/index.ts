import ClipboardJS from 'clipboard'
import type { CustomDirectiveFC } from '../../types'
import type { CopyElement } from './types'

const createClipboard = (
  el: CopyElement,
  value: string,
  notify?: (success: boolean) => void,
) => {
  const clipboard = new ClipboardJS(el, {
    text: () => value,
  })

  el.$$clipboard = clipboard

  el.$$clipboard.on('success', () => {
    notify?.(true)
  })
  el.$$clipboard.on('error', () => {
    notify?.(false)
  })
}

export const createCopyDirective = (
  notify?: (success: boolean) => void,
): ReturnType<CustomDirectiveFC<CopyElement, string>> => {
  return {
    mounted: (el, { value }) => {
      createClipboard(el, value, notify)
    },
    updated: (el, { value, oldValue }) => {
      if (value !== oldValue) {
        el.$$clipboard?.destroy()

        createClipboard(el, value, notify)
      }
    },
    beforeUnmount: (el: CopyElement) => {
      if (el.$$clipboard) {
        el.$$clipboard?.destroy()

        el.$$clipboard = null
      }
    },
  }
}

export default () => createCopyDirective()
