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
 *
 * 该指令用于处理复制，使用的时候必须传递正确的 value 值。
 *
 * 指令基于 clipboard.js 实现。
 *
 * 使用方式：
 * @example
 * <template>
 *  <button v-copy="copyText">复制</button>
 * </template>
 */

import ClipboardJS from 'clipboard'

import type { CopyElement } from './types'
import type { CustomDirectiveFC } from '@/directives/types'

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
