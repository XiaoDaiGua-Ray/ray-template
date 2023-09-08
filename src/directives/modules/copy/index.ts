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

const copyDirective: CustomDirectiveFC<CopyElement, string> = () => {
  return {
    mounted: (el, { value }) => {
      const clipboard = new ClipboardJS(el, {
        text: () => value,
      })

      clipboard.on('success', () => {
        window.$message.success('复制成功')
      })
      clipboard.on('error', () => {
        window.$message.error('复制失败')
      })

      el.$$clipboard = clipboard
    },
    updated: (el, { value, oldValue }) => {
      if (value !== oldValue) {
        el.$$clipboard?.destroy()

        el.$$clipboard = new ClipboardJS(el, {
          text: () => value,
        })
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
