/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-03-27
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

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
} from 'naive-ui'

import { useForm } from '@/components'

import type { RFormRules } from '@/components'

export default defineComponent({
  name: 'RFormDemo',
  setup() {
    // 使用以下 hooks 的时候，应该注意调用时机
    const [
      register,
      { getFormInstance, validate, restoreValidation, formModel, formRules },
    ] = useForm(
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
     * 如果待验证数据类型为: number, array 等，需要手动设置 type 类型。
     * 具体可以吃查看: async-validator type
     * @see https://github.com/yiminghe/async-validator?tab=readme-ov-file#type
     *
     * 如果你需要自定义验证，可以查看：naive ui custom validation
     * @see https://www.naiveui.com/zh-CN/dark/components/form#custom-validation.vue
     *
     * 如果只是简单的 rules 管理，可以在初始化 useForm 的时候传入第二个参数；
     * 然后使用 formRules 方法获取到初始化 rules 数据。
     */
    const rules = ref(formRules())
    /**
     *
     * @description
     * 如果只是简单的数据，可以在初始化 useForm 的时候直接传入第一个参数；
     * 然后使用 formModel 方法获取到初始化 model 数据。
     *
     * 动态的复杂数据，不建议使用该方法管理 model；手动的拆分出来是一个更加好的选择。
     */
    const condition = ref(formModel())

    return {
      register,
      rules,
      condition,
      restoreValidation,
      formModel,
      validate,
    }
  },
  render() {
    const { rules } = this
    const { register, restoreValidation, formModel, validate } = this

    return (
      <RForm onRegister={register} rules={rules} model={this.condition}>
        <NGrid cols={24} xGap={24}>
          <NFormItemGi label="姓名" path="name" span={12}>
            <NInput v-model:value={this.condition.name} />
          </NFormItemGi>
          <NFormItemGi label="年龄" path="age" span={12}>
            <NInputNumber
              v-model:value={this.condition.age}
              showButton={false}
              style="width: 100%"
            />
          </NFormItemGi>
          <NFormItemGi label="出生日期" path="date" span={12}>
            <NDatePicker
              v-model:value={this.condition.date}
              style="width: 100%"
            />
          </NFormItemGi>
          <NFormItemGi label="性别" path="gender" span={12}>
            <NRadioGroup v-model:value={this.condition.gender}>
              <NRadio value="girl">女</NRadio>
              <NRadio value="man">男</NRadio>
            </NRadioGroup>
          </NFormItemGi>
          <NFormItemGi label="备注信息" span={24}>
            <NInput type="textarea" v-model:value={this.condition.remark} />
          </NFormItemGi>
          <NFormItemGi span={24}>
            <NFlex justify="flex-end" style="width: 100%">
              <NButton
                type="info"
                onClick={() => {
                  this.condition = formModel()
                }}
              >
                重置表单为初始状态
              </NButton>
              <NButton type="warning" onClick={restoreValidation.bind(this)}>
                移除校验状态
              </NButton>
              <NButton type="primary" onClick={() => validate()}>
                校验
              </NButton>
            </NFlex>
          </NFormItemGi>
        </NGrid>
      </RForm>
    )
  },
})
