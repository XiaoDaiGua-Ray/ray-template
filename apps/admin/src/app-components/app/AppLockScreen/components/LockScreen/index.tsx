import AppAvatar from '@/app-components/app/AppAvatar'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import {
  useCondition,
  useLockRules,
} from '@/app-components/app/AppLockScreen/shared'
import { APP_CATCH_KEY } from '@/app-config'
import { useI18n } from '@/hooks'
import { useSettingActions } from '@/store'
import { encrypt, setStorage } from '@/utils'
import { RForm, useForm } from '@ray-template/ui/form'
import { NButton, NFormItem, NInput } from 'naive-ui'
import type { InputInst } from 'naive-ui'
import { useTemplateRef } from 'vue'

const LockScreen = defineComponent({
  name: 'LockScreen',
  setup() {
    const { t } = useI18n('appComponents.lockScreen')
    const rules = useLockRules()
    const [register, { validate }] = useForm()
    const inputInstRef = useTemplateRef<InputInst | null>('inputInstRef')

    const { setLockAppScreen } = useAppLockScreen()
    const { updateSettingState } = useSettingActions()

    const state = reactive({
      lockCondition: useCondition(),
    })

    let validating = false
    /**
     *
     * @description
     * 校验成功后先保存密码，再启用锁屏；重复触发与字段校验失败不会写入状态。
     */
    const lockScreen = async () => {
      if (validating) return

      validating = true

      try {
        try {
          await validate()
        } catch {
          return
        }

        setStorage(
          APP_CATCH_KEY.appLockScreenPasswordKey,
          encrypt(state.lockCondition.lockPassword),
          'localStorage',
        )
        setLockAppScreen(true)
        updateSettingState('lockScreenSwitch', false)
        state.lockCondition = useCondition()
      } finally {
        validating = false
      }
    }

    onMounted(() => {
      nextTick(() => {
        inputInstRef.value?.focus()
      })
    })

    return {
      ...toRefs(state),
      lockScreen,
      register,
      inputInstRef,
      rules,
      t,
    }
  },
  render() {
    const { register } = this

    return (
      <div class="app-lock-screen__content">
        <div class="app-lock-screen__input">
          <AppAvatar
            avatarSize={52}
            style="pointer-events: none;margin: 24px 0;"
            vertical
          />
          <RForm
            ref="formInstRef"
            model={this.lockCondition}
            rules={this.rules}
            labelPlacement="left"
            onRegister={register}
          >
            <NFormItem path="lockPassword">
              <NInput
                ref="inputInstRef"
                v-model:value={this.lockCondition.lockPassword}
                type="password"
                placeholder={this.t('lockPlaceholder')}
                clearable
                showPasswordOn="click"
                minlength={6}
                maxlength={12}
                onKeydown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' && !e.isComposing && !e.repeat) {
                    return this.lockScreen()
                  }
                }}
                autofocus
              />
            </NFormItem>
            <NButton type="primary" onClick={this.lockScreen}>
              {this.t('lock')}
            </NButton>
          </RForm>
        </div>
      </div>
    )
  },
})

export default LockScreen
