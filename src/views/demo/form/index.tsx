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
} from 'naive-ui'

import { useForm } from '@/components'

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
        getFormInstance,
        validate,
        restoreValidation,
        formModel,
        formRules,
        reset,
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

    /**
     *
     * @description
     * 如果只是简单的数据，可以在初始化 useForm 的时候直接传入第一个参数；
     * 然后使用 formModel 方法获取到初始化 model 数据。
     *
     * 当然，在 vue 中，推荐使用该方法进行表单值的初始化操作；
     * 因为，可以在你需要的时候实现便捷的一键初始化表单需求。
     */
    const condition = ref(formModel())

    /**
     *
     * @param key 需要校验的字段。
     *
     * @see https://www.naiveui.com/zh-CN/dark/components/form#partially-apply-rules.vue
     *
     * @description
     * 执行部分的校验规则。
     */
    const onlyValidateSection = (key: string) => {
      validate(void 0, (rules) => {
        return rules?.key === key
      })
    }

    return {
      register,
      condition,
      restoreValidation,
      validate,
      formRules,
      onlyValidateSection,
      reset,
    }
  },
  render() {
    const { condition } = this
    const {
      register,
      restoreValidation,
      validate,
      formRules,
      onlyValidateSection,
      reset,
    } = this

    return (
      <NCard title="useForm 表单校验">
        <RForm onRegister={register} rules={formRules()} model={condition}>
          <NGrid cols={24} xGap={24}>
            <NFormItemGi label="姓名" path="name" span={12}>
              <NInput v-model:value={condition.name} />
            </NFormItemGi>
            <NFormItemGi label="年龄" path="age" span={12}>
              <NInputNumber
                v-model:value={condition.age}
                showButton={false}
                style="width: 100%"
              />
            </NFormItemGi>
            <NFormItemGi label="出生日期" path="date" span={12}>
              <NDatePicker v-model:value={condition.date} style="width: 100%" />
            </NFormItemGi>
            <NFormItemGi label="性别" path="gender" span={12}>
              <NRadioGroup v-model:value={condition.gender}>
                <NRadio value="girl">女</NRadio>
                <NRadio value="man">男</NRadio>
              </NRadioGroup>
            </NFormItemGi>
            <NFormItemGi label="备注信息" span={24}>
              <NInput type="textarea" v-model:value={condition.remark} />
            </NFormItemGi>
            <NFormItemGi span={24}>
              <NFlex justify="flex-end" style="width: 100%">
                <NButton type="info" onClick={() => reset(this.condition)}>
                  重置表单为初始状态
                </NButton>
                <NButton type="warning" onClick={restoreValidation.bind(this)}>
                  移除校验状态
                </NButton>
                <NButton
                  type="primary"
                  onClick={() => onlyValidateSection('name')}
                >
                  仅校验姓名字段
                </NButton>
                <NButton type="primary" onClick={() => validate()}>
                  校验
                </NButton>
                <NButton attrType="reset">重置</NButton>
              </NFlex>
            </NFormItemGi>
          </NGrid>
        </RForm>
      </NCard>
    )
  },
})
