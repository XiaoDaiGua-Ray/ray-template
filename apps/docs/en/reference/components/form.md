# RForm and useForm {#rform-与-useform}

<script setup>
import AdminExample from '../../../examples/AdminExample.vue'
</script>

`RForm` wraps Naive UI Form and uses a spinner for submission or loading. Match `NFormItem.path` to the `model` field and update the value from the input.

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
          message: 'Enter a name',
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
        <NFormItem label="Name" path="name">
          <NInput
            value={form.formConditionRef.value.name}
            onUpdateValue={(name) => form.updateFormCondition({ name })}
          />
        </NFormItem>
        <NButton onClick={() => void submit().catch(() => {})}>
          Validate and submit
        </NButton>
        <NButton onClick={() => form.reset()}>Reset</NButton>
      </RForm>
    )
  },
})
```

## Interactive example {#交互示例}

<AdminExample path="/form" title="Validate and reset a form" />

::: details View example source
<<< @/../admin/src/views/demo/form/index.tsx
:::

## Props and events {#属性与事件}

The component inherits public `NForm` props and `onSubmit` and forwards the default slot to `NForm`.

| Prop                 | Default | Description                                                                                                                                                                      |
| -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading`            | `false` | Caller-controlled outer spinner.                                                                                                                                                 |
| `loadingDescription` | None    | Loading description.                                                                                                                                                             |
| `autocomplete`       | `'off'` | Written to the form element on mount.                                                                                                                                            |
| `submitWhenEnter`    | `false` | Can be enabled dynamically for single-line input. Successful validation calls `onFinish`. Repeated submissions are ignored while loading or while a prior submission is pending. |
| `onFinish`           | None    | Called after Enter-triggered validation succeeds. Custom submit buttons should call `validate()` and perform the submission.                                                     |
| `onRegister(inst)`   | None    | Provides the Naive UI Form instance after mount. Accepts a callback or array.                                                                                                    |

Enter keeps its native behavior for IME confirmation, multiline input, comboboxes, buttons, modifier keys, and controls that already called `preventDefault()`. The form displays validation failures from keyboard submission. Vue error handling receives exceptions from `onFinish`. Handle rejected `useForm.validate()` promises. Access Form instance methods through the registration hook.

## useForm

`useForm(model?, rules?)` returns `[register, actions]`. Bind `register` to `onRegister`. Initial values and rules can be objects or factories. Objects are deep-cloned. Factory results are used directly, so return a new object each time.

| Return value                                | Behavior                                                                                     |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `formConditionRef`                          | Reactive model for `RForm.model` and input bindings.                                         |
| `formModel()` / `formRules()`               | Get fresh initial model and rules.                                                           |
| `getFormInstance()`                         | Get the registered instance. Throws before registration or after unmount.                    |
| `validate(callback?, shouldRuleBeApplied?)` | Forwards Naive UI validation. Handle rejection on failure.                                   |
| `validateTargetField(key)`                  | Selects rules by their unique `key`, which can differ from `NFormItem.path`.                 |
| `restoreValidation()`                       | Clears validation and retains input.                                                         |
| `updateFormCondition(values)`               | Shallow-merges the current model and keeps initial values.                                   |
| `reset(values?)`                            | Merges initial values with overrides and clears validation. Dynamically added fields remain. |

Call instance methods after the form mounts and registers. Declare nullable fields in the initial model and use an empty value appropriate for each input. When updating nested fields, account for the shallow merge.

[Component source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RForm/src/Form.tsx) · [useForm source](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/packages/ui/src/RForm/src/hooks/useForm.ts) · [Form example](https://github.com/XiaoDaiGua-Ray/ray-template/blob/main/apps/admin/src/views/demo/form/index.tsx)
