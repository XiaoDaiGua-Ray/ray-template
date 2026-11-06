## Purpose

> Entry point for global custom directives.

## Conventions

- Directives should provide reusable, application-wide behavior.
- When a directive depends on application data, account for data ownership and the timing of registration and usage.

## Adding a directive

- Each directory in modules is treated as one global directive; its directory name is also the directive name.
- Every directive directory must export through a file named `index.ts`.
- All directives in modules are automatically incorporated into the template.

```ts
/**
 *
 * 示例添加 demo 指令
 */

// 1. modules 中添加文件包
// 2. modules/demo 目录下创建 index.ts 文件
// 3. 进行自定义指令开发

import type { CustomDirectiveFC } from '@/directives/type'
import type { Directive } from 'vue'
import type { RoleBindingValue } from './type'

const demoDirective: CustomDirectiveFC<HTMLElement, RoleBindingValue> = () => {
  return {
    beforeMount: (el, binding) => {
      console.log(el, binding)
    },
  }
}

export default demoDirective

// 4. 按照上述步骤执行后，会自动在模板中创建一个 v-demo 的指令供全局使用
```

## Usage and attribution

Keep directive usage and binding examples in the [usage guide](README.DIR.md), rather than repeating full tutorials before directive factories. `disabled` restricts CSS interaction only; business permissions and submission validation still require separate handling.

Retain the existing [Pure Admin attribution](https://github.dev/pure-admin/vue-pure-admin/blob/main/src/components/ReCol/index.ts) for the ripple helper. Follow the [repository comment style](../../../../docs/comment-style.md) for new comments.
