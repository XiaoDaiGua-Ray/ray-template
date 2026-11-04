import type { InputInst } from 'naive-ui'
import type { Ref } from 'vue'

/** 统一的校验锁屏密码校验规则 */
export const rules = {
  lockPassword: {
    required: true,
    message: '请输入正确格式密码',
    min: 6,
    max: 12,
    trigger: ['input'],
  },
}

/** 锁屏密码参数 */
export const useCondition = () => {
  return {
    lockPassword: null,
  }
}
