/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-20
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

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

/** 自动获取焦点 */
export const autoFouceInput = (inputInstRef: Ref<InputInst | null>) => {
  nextTick(() => {
    inputInstRef.value?.focus()
  })
}
