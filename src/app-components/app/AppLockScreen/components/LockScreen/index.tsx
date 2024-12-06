import { NInput, NFormItem, NButton } from 'naive-ui'
import AppAvatar from '@/app-components/app/AppAvatar'
import { RForm } from '@/components'

import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import { rules, useCondition } from '@/app-components/app/AppLockScreen/shared'
import { useSettingActions } from '@/store'
import { useTemplateRef } from 'vue'
import { useForm } from '@/components'

import type { InputInst } from 'naive-ui'

const LockScreen = defineComponent({
  name: 'LockScreen',
  setup() {
    const [register, { validate }] = useForm()
    const inputInstRef = useTemplateRef<InputInst | null>('inputInstRef')

    const { setLockAppScreen } = useAppLockScreen()
    const { updateSettingState } = useSettingActions()

    const state = reactive({
      lockCondition: useCondition(),
    })

    const lockScreen = () => {
      validate().then(() => {
        setLockAppScreen(true)
        updateSettingState('lockScreenSwitch', false)

        state.lockCondition = useCondition()
      })
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
            rules={rules}
            labelPlacement="left"
            onRegister={register}
          >
            <NFormItem path="lockPassword">
              <NInput
                ref="inputInstRef"
                v-model:value={this.lockCondition.lockPassword}
                type="password"
                placeholder="请输入锁屏密码"
                clearable
                showPasswordOn="click"
                minlength={6}
                maxlength={12}
                onKeydown={(e: KeyboardEvent) => {
                  if (e.code === 'Enter') {
                    this.lockScreen()
                  }
                }}
                autofocus
              />
            </NFormItem>
            <NButton type="primary" onClick={this.lockScreen.bind(this)}>
              锁屏
            </NButton>
          </RForm>
        </div>
      </div>
    )
  },
})

export default LockScreen
