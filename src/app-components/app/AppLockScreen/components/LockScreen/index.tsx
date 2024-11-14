import { NInput, NForm, NFormItem, NButton } from 'naive-ui'

import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import { rules, useCondition } from '@/app-components/app/AppLockScreen/shared'
import { useSettingGetters, useSettingActions } from '@/store'

import type { FormInst, InputInst } from 'naive-ui'

const LockScreen = defineComponent({
  name: 'LockScreen',
  setup() {
    const formInstRef = ref<FormInst | null>(null)
    const inputInstRef = ref<InputInst | null>(null)

    const { setLockAppScreen } = useAppLockScreen()
    const { updateSettingState } = useSettingActions()

    const state = reactive({
      lockCondition: useCondition(),
    })

    /** 锁屏 */
    const lockScreen = () => {
      formInstRef.value?.validate((error) => {
        if (!error) {
          setLockAppScreen(true)
          updateSettingState('lockScreenSwitch', false)

          state.lockCondition = useCondition()
        }
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
      formInstRef,
      inputInstRef,
    }
  },
  render() {
    return (
      <div class="app-lock-screen__content">
        <div class="app-lock-screen__input">
          <NForm
            ref="formInstRef"
            model={this.lockCondition}
            rules={rules}
            labelPlacement="left"
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
              />
            </NFormItem>
            <NButton type="primary" onClick={this.lockScreen.bind(this)}>
              锁屏
            </NButton>
          </NForm>
        </div>
      </div>
    )
  },
})

export default LockScreen
