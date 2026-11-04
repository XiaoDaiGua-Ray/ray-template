import { setupDirectives as setup } from '@ray-template/directives'
import { createCopyDirective } from '@ray-template/directives/copy'
import type { App } from 'vue'

export function setupDirectives(app: App<Element>) {
  setup(app, {
    copy: createCopyDirective((success) => {
      if (success) window.$message?.success('复制成功')
      else window.$message?.error('复制失败')
    }),
  })
}
