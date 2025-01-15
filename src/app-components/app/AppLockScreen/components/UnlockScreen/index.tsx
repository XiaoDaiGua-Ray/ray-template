import '../../index.scss'

import { NInput, NFormItem, NButton, NFlex } from 'naive-ui'
import AppAvatar from '@/app-components/app/AppAvatar'
import { RForm } from '@/components'

import dayjs from 'dayjs'
import { useSigningActions, useSettingActions } from '@/store'
import { rules, useCondition } from '@/app-components/app/AppLockScreen/shared'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import { useDevice } from '@/hooks'
import { useForm } from '@/components'
import { APP_CATCH_KEY } from '@/app-config'
import { removeStorage, decrypt, getStorage } from '@/utils'

export default defineComponent({
  name: 'UnlockScreen',
  setup() {
    const [register, { validate }] = useForm()

    const { logout } = useSigningActions()
    const { updateSettingState } = useSettingActions()
    const { setLockAppScreen } = useAppLockScreen()
    const { isTabletOrSmaller } = useDevice()

    const HH_MM_FORMAT = 'HH:mm'
    const AM_PM_FORMAT = 'A'
    const YY_MM_DD_FORMAT = 'YYYY-MM-DD'
    const DDD_FORMAT = 'ddd'

    const state = reactive({
      lockCondition: useCondition(),
      HH_MM: dayjs().format(HH_MM_FORMAT),
      AM_PM: dayjs().format(AM_PM_FORMAT),
      YY_MM_DD: dayjs().format(YY_MM_DD_FORMAT),
      DDD: dayjs().format(DDD_FORMAT),
    })
    const dayInterval = setInterval(() => {
      state.HH_MM = dayjs().format(HH_MM_FORMAT)
      state.AM_PM = dayjs().format(AM_PM_FORMAT)
    }, 6_000)
    const yearInterval = setInterval(() => {
      state.YY_MM_DD = dayjs().format(YY_MM_DD_FORMAT)
      state.DDD = dayjs().format(DDD_FORMAT)
    }, 86_400_000)

    const toSigningFn = () => {
      removeStorage(APP_CATCH_KEY.appLockScreenPasswordKey, 'localStorage')
      updateSettingState('lockScreenSwitch', false)
      setTimeout(() => {
        logout()
      }, 100)
    }

    const backToSigning = () => {
      window.$dialog.warning({
        title: '警告',
        content: '是否返回到登陆页并且重新登录',
        positiveText: '确定',
        negativeText: '重新登录',
        onPositiveClick: toSigningFn,
      })
    }

    const unlockScreen = () => {
      const catchPassword = getStorage<string>(
        APP_CATCH_KEY.appLockScreenPasswordKey,
        'localStorage',
      )

      if (!catchPassword) {
        window.$dialog.warning({
          title: '警告',
          content: () => '检测到锁屏密码被修改，请重新登录',
          closable: false,
          maskClosable: false,
          closeOnEsc: false,
          positiveText: '重新登录',
          onPositiveClick: toSigningFn,
        })

        return
      }

      const dCatchPassword = decrypt(catchPassword)

      validate().then(() => {
        if (dCatchPassword === state.lockCondition.lockPassword) {
          setLockAppScreen(false)
          updateSettingState('lockScreenSwitch', false)
          removeStorage(APP_CATCH_KEY.appLockScreenPasswordKey, 'localStorage')

          state.lockCondition = useCondition()
        } else {
          window.$message.warning('密码错误，请重新输入')
        }
      })
    }

    onBeforeUnmount(() => {
      clearInterval(dayInterval)
      clearInterval(yearInterval)
    })

    return {
      ...toRefs(state),
      backToSigning,
      unlockScreen,
      isTabletOrSmaller,
      register,
    }
  },
  render() {
    const { isTabletOrSmaller } = this
    const { HH_MM, AM_PM, YY_MM_DD, DDD } = this
    const hmSplit = HH_MM.split(':')
    const { unlockScreen, backToSigning, register } = this

    return (
      <div class="app-lock-screen__content app-lock-screen__content--full">
        <div class="app-lock-screen__unlock">
          <div class="app-lock-screen__unlock__content">
            <div class="app-lock-screen__unlock__content-wrapper">
              <div
                class={[
                  'app-lock-screen__unlock__content-bg__wrapper',
                  'app-lock-screen__unlock__content-bg',
                  isTabletOrSmaller
                    ? 'app-lock-screen__unlock__content-bg--smaller'
                    : '',
                ]}
              >
                <div class="left">{hmSplit[0]}</div>
                <div class="right">{hmSplit[1]}</div>
              </div>
            </div>
            <div class="app-lock-screen__unlock__content-avatar">
              <AppAvatar
                avatarSize={52}
                style="pointer-events: none;"
                vertical
              />
            </div>
            <div class="app-lock-screen__unlock__content-input">
              <RForm
                onRegister={register}
                model={this.lockCondition}
                rules={rules}
              >
                <NFormItem path="lockPassword">
                  <NInput
                    autofocus
                    v-model:value={this.lockCondition.lockPassword}
                    type="password"
                    placeholder="请输入解锁密码"
                    clearable
                    minlength={6}
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.code === 'Enter') {
                        unlockScreen()
                      }
                    }}
                  />
                </NFormItem>
                <NFlex justify="space-between">
                  <NButton
                    type="primary"
                    text
                    onClick={backToSigning.bind(this)}
                  >
                    返回登陆
                  </NButton>
                  <NButton
                    type="primary"
                    text
                    onClick={unlockScreen.bind(this)}
                  >
                    进入系统
                  </NButton>
                </NFlex>
              </RForm>
            </div>
            <div class="app-lock-screen__unlock__content-date">
              <div class="current-year">
                {YY_MM_DD}&nbsp;<span>{DDD}</span>&nbsp;<span>{AM_PM}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
