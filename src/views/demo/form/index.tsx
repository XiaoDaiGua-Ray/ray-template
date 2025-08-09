import { RForm } from '@/components'
import {
  NFormItemGi,
  NDatePicker,
  NGrid,
  NInput,
  NInputNumber,
  NFlex,
  NButton,
  NRadio,
  NRadioGroup,
  NCard,
  NText,
  NSwitch,
} from 'naive-ui'

import { useForm } from '@/components'
import { useHookPlusRequest } from '@/axios'

interface FormModel {
  name: string | null
  age: number | null
  gender: string | null
  date: Date | null
  remark: string | null
}

export default defineComponent({
  name: 'RFormDemo',
  setup() {
    // 使用以下 hooks 的时候，应该注意调用时机
    const [
      register,
      {
        validate,
        restoreValidation,
        formRules,
        reset,
        validateTargetField,
        formConditionRef,
      },
    ] = useForm<FormModel>(
      {
        name: null,
        age: null,
        gender: null,
        date: null,
        remark: null,
      },
      {
        name: {
          required: true,
          message: '请输入姓名',
          trigger: ['blur', 'change'],
          key: 'name',
        },
        date: {
          required: true,
          message: '请选择日期',
          trigger: ['blur', 'change'],
          type: 'number',
        },
        gender: {
          required: true,
          message: '请选择性别',
          trigger: 'change',
        },
        age: {
          required: true,
          message: '请输入年龄',
          trigger: ['blur', 'change'],
          type: 'number',
        },
      },
    )

    const formLoading = ref(false)

    const { run: runHookPlusRequest } = useHookPlusRequest(
      () => {
        return new Promise((resolve, reject) => {
          validate()
            .then(() => {
              formLoading.value = true

              setTimeout(() => {
                window.$message.success('校验成功')
                resolve(true)
              }, 500)
            })
            .catch(reject)
            .finally(() => {
              formLoading.value = false
            })
        })
      },
      {
        manual: true,
      },
    )

    return {
      register,
      formConditionRef,
      restoreValidation,
      validate,
      formRules,
      validateTargetField,
      reset,
      formLoading,
      runHookPlusRequest,
    }
  },
  render() {
    const { formConditionRef } = this
    const {
      register,
      restoreValidation,
      formRules,
      validateTargetField,
      reset,
      runHookPlusRequest,
    } = this

    return (
      <NCard
        title={() => (
          <NFlex align="center">
            <NText>useForm 表单校验</NText>
            <NSwitch v-model:value={this.formLoading} />
          </NFlex>
        )}
      >
        {{
          default: () => (
            <RForm
              onRegister={register}
              rules={formRules()}
              model={formConditionRef}
              submitWhenEnter
              onFinish={() => {
                window.$message.success('表单提交成功')
              }}
              loading={this.formLoading}
            >
              <NGrid cols={24} xGap={24}>
                <NFormItemGi label="姓名" path="name" span={12}>
                  <NInput v-model:value={formConditionRef.name} />
                </NFormItemGi>
                <NFormItemGi label="年龄" path="age" span={12}>
                  <NInputNumber
                    v-model:value={formConditionRef.age}
                    showButton={false}
                  />
                </NFormItemGi>
                <NFormItemGi label="出生日期" path="date" span={12}>
                  <NDatePicker v-model:value={formConditionRef.date} />
                </NFormItemGi>
                <NFormItemGi label="性别" path="gender" span={12}>
                  <NRadioGroup v-model:value={formConditionRef.gender}>
                    <NRadio value="girl">女</NRadio>
                    <NRadio value="man">男</NRadio>
                  </NRadioGroup>
                </NFormItemGi>
                <NFormItemGi label="备注信息" span={24}>
                  <NInput
                    type="textarea"
                    v-model:value={formConditionRef.remark}
                  />
                </NFormItemGi>
                <NFormItemGi span={24}>
                  <NFlex>
                    <NButton type="info" onClick={() => reset()}>
                      重置表单为初始状态
                    </NButton>
                    <NButton type="warning" onClick={restoreValidation}>
                      移除校验状态
                    </NButton>
                    <NButton
                      type="primary"
                      onClick={() => validateTargetField('name')}
                    >
                      仅校验姓名字段
                    </NButton>
                    <NButton type="primary" onClick={runHookPlusRequest}>
                      校验
                    </NButton>
                  </NFlex>
                </NFormItemGi>
              </NGrid>
            </RForm>
          ),
          'header-extra': () => '输入表单的时候，试试按下 Enter 键',
        }}
      </NCard>
    )
  },
})
