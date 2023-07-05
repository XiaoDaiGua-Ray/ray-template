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

import type { Directive } from 'vue'
import type { CopyElement } from './type'

let clipboard: ClipboardJS | null

const copyDirective: Directive<CopyElement, string> = {
  mounted: (el, binding) => {
    const value = binding.value

    clipboard = new ClipboardJS(el, {
      text: () => String(value),
    })

    clipboard?.on('success', () => {
      window.$message.success('复制成功')
    })
    clipboard?.on('error', () => {
      window.$message.error('复制失败')
    })
  },
  updated: (el, binding) => {
    /** 其实这块代码写的挺蠢的, 但是我目前不知道怎么去优化, 阿巴阿巴阿巴 */
    const value = binding.value

    clipboard = new ClipboardJS(el, {
      text: () => String(value),
    })
  },
  beforeUnmount: () => {
    clipboard?.destroy()

    clipboard = null
  },
}

export default copyDirective
