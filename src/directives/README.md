## 说明

> 全局自定义指令入口。

## 规范

- 指令应该为全局的通用性指令
- 如果指令需要与系统的数据进行关联，应该注意数据的管理与指令注册使用时机

## 新增指令说明

- 模板视 modules 中每一个文件包为一个模板的指令（全局），并且每个文件包的名称，也被视为该指令名称
- 添加文件包后，`强制要求 index.ts 为指令的输出文件名`
- modules 包中所有指令都会被自动合并到模板中

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

## 说明与来源

指令用法与绑定值示例统一维护在 [使用说明](README.DIR.md)，不在指令工厂前重复整段教程。`disabled` 仅限制 CSS 交互，业务权限和提交校验仍需独立处理。

水波纹辅助实现保留原有 [Pure Admin 来源标注](https://github.dev/pure-admin/vue-pure-admin/blob/main/src/components/ReCol/index.ts)。新增注释遵循 [仓库注释规范](../../docs/comment-style.md)。
