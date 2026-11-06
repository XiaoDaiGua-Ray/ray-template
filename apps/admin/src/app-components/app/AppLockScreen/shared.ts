import { useI18n } from '@/hooks'
import type { FormRules } from 'naive-ui'

/**
 *
 * @description
 * 创建锁屏密码规则，错误文案随当前语言更新。
 *
 * @returns 密码长度为 6 至 12 位的校验规则
 */
export const useLockRules = () => {
  const { t } = useI18n('appComponents.lockScreen')

  return computed<FormRules>(() => ({
    lockPassword: {
      required: true,
      message: t('passwordRule'),
      min: 6,
      max: 12,
      trigger: ['input'],
    },
  }))
}

/**
 *
 * @description
 * 创建独立的密码输入模型，锁定或解锁完成后用于清空输入。
 *
 * @returns 空密码模型
 */
export const useCondition = () => {
  return {
    lockPassword: null as string | null,
  }
}
