# RForm 与 useForm

`RForm` 包装 Naive UI Form，并用 Spin 显示提交或查询状态。用 `NFormItem.path` 匹配 `model` 的字段，在输入组件上更新值。

```tsx
import { RForm, useForm } from '@/components'
import { NButton, NFormItem, NInput } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const [register, form] = useForm(
      { name: '' },
      {
        name: {
          key: 'name',
          required: true,
          message: '请输入姓名',
          trigger: 'blur',
        },
      },
    )
    const rules = form.formRules()
    const submit = async () => {
      await form.validate()
      console.log(form.formConditionRef.value.name)
    }
    return () => (
      <RForm
        onRegister={register}
        model={form.formConditionRef.value}
        rules={rules}
      >
        <NFormItem label="姓名" path="name">
          <NInput
            value={form.formConditionRef.value.name}
            onUpdateValue={(name) => form.updateFormCondition({ name })}
          />
        </NFormItem>
        <NButton onClick={() => void submit().catch(() => {})}>
          校验并提交
        </NButton>
        <NButton onClick={() => form.reset()}>重置</NButton>
      </RForm>
    )
  },
})
```

## 属性与事件

除 `onSubmit` 外，继承 `NForm` 的公开属性。默认插槽传给 `NForm`。

| 属性                 | 默认    | 说明                                                                   |
| -------------------- | ------- | ---------------------------------------------------------------------- |
| `loading`            | `false` | 外层 Spin 状态，由调用方开关。                                         |
| `loadingDescription` | 无      | 加载说明。                                                             |
| `autocomplete`       | `'off'` | 挂载时写到表单 DOM。                                                   |
| `submitWhenEnter`    | `false` | 创建时启用 Enter 捕获，阻止默认行为，校验成功后调用 `onFinish`。       |
| `onFinish`           | 无      | Enter 校验完成回调。自定义提交按钮要自行调用 `validate()` 并执行提交。 |
| `onRegister(inst)`   | 无      | 挂载后传出 Naive UI Form 实例。接受单函数或回调数组。                  |

含多行输入、搜索选择器或嵌套表单时，先确认 Enter 是否应被捕获。组件没有把 Form 方法直接暴露为模板 ref。

## useForm

`useForm(model?, rules?)` 返回 `[register, actions]`，把 `register` 绑定给 `onRegister`。初始化值和规则可用对象或工厂；对象会深拷贝，工厂结果直接使用，建议每次创建新对象。

| 返回项                                      | 行为                                                               |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `formConditionRef`                          | 响应式模型，传给 `RForm.model` 并用于输入绑定。                    |
| `formModel()` / `formRules()`               | 重新取得初始模型和规则。                                           |
| `getFormInstance()`                         | 获取已注册实例，未注册时抛错。                                     |
| `validate(callback?, shouldRuleBeApplied?)` | 透传 Naive UI 校验；失败要处理 Promise 拒绝。                      |
| `validateTargetField(key)`                  | 按规则对象的唯一 `key` 筛选规则，`key` 不等同于 `NFormItem.path`。 |
| `restoreValidation()`                       | 清除当前校验状态，保留输入。                                       |
| `updateFormCondition(values)`               | 浅合并当前模型，不改初始值。                                       |
| `reset(values?)`                            | 合并初始值和覆盖值，然后清除校验。动态新增字段不会被自动删除。     |

实例相关方法要在表单挂载并注册后调用。可空字段应在初始模型中显式声明，并为所用输入选用合适的空值。修改嵌套字段时注意更新是浅合并。

[组件源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RForm/src/Form.tsx) · [useForm 源码](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RForm/src/hooks/useForm.ts) · [表单示例](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/demo/form/index.tsx)
