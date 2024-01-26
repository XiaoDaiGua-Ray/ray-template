/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * directive name: copy
 */

import ClipboardJS from 'clipboard'

import type { CopyElement } from './type'
import type { CustomDirectiveFC } from '@/directives/type'

const createClipboard = (el: CopyElement, value: string) => {
  const clipboard = new ClipboardJS(el, {
    text: () => value,
  })

  el.$$clipboard = clipboard

  el.$$clipboard.on('success', () => {
    window.$message.success('复制成功')
  })
  el.$$clipboard.on('error', () => {
    window.$message.error('复制失败')
  })
}

const copyDirective: CustomDirectiveFC<CopyElement, string> = () => {
  return {
    mounted: (el, { value }) => {
      createClipboard(el, value)
    },
    updated: (el, { value, oldValue }) => {
      if (value !== oldValue) {
        el.$$clipboard?.destroy()

        createClipboard(el, value)
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

export default copyDirective
