import '../../index.scss'
import AppAvatar from '@/app-components/app/AppAvatar'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import {
  useCondition,
  useLockRules,
} from '@/app-components/app/AppLockScreen/shared'
import { APP_CATCH_KEY } from '@/app-config'
import { useDevice, useI18n } from '@/hooks'
import {
  useSettingActions,
  useSettingGetters,
  useSigningActions,
} from '@/store'
import { decrypt, getStorage, removeStorage } from '@/utils'
import { RForm, useForm } from '@ray-template/ui/form'
import { useEventListener } from '@vueuse/core'
import dayjs from 'dayjs'
import { NButton, NFlex, NFormItem, NInput } from 'naive-ui'

export default defineComponent({
  name: 'UnlockScreen',
  setup() {
    const { t } = useI18n('appComponents.lockScreen')
    const rules = useLockRules()
    const [register, { validate }] = useForm()

    const { logout } = useSigningActions()
    const { updateSettingState } = useSettingActions()
    const { setLockAppScreen } = useAppLockScreen()
    const { isTabletOrSmaller } = useDevice()
    const { getLocaleLanguage } = useSettingGetters()
    const now = shallowRef(dayjs())
    const clock = computed(() => {
      const date = now.value.locale(
        getLocaleLanguage.value === 'zh-CN' ? 'zh-cn' : 'en',
      )

      return {
        HH_MM: date.format('HH:mm'),
        AM_PM: date.format('A'),
        YY_MM_DD: date.format('YYYY-MM-DD'),
        DDD: date.format('ddd'),
      }
    })

    const state = reactive({
      lockCondition: useCondition(),
    })
    let clockTimer: ReturnType<typeof setTimeout> | undefined

    /**
     *
     * @description
     * 按分钟边界更新全部时间字段；页面隐藏时暂停，恢复可见时立即校准，避免跨日日期滞后。
     */
    const updateClock = () => {
      clearTimeout(clockTimer)

      if (document.hidden) return

      now.value = dayjs()
      clockTimer = setTimeout(updateClock, 60_000 - (Date.now() % 60_000))
    }

    onMounted(updateClock)
    useEventListener(document, 'visibilitychange', updateClock)
    onBeforeUnmount(() => clearTimeout(clockTimer))

    /**
     *
     * @description
     * 清理锁屏密码并执行统一退出流程，不创建脱离组件生命周期的延迟计时器。
     */
    const toSigningFn = async () => {
      removeStorage(APP_CATCH_KEY.appLockScreenPasswordKey, 'localStorage')
      updateSettingState('lockScreenSwitch', false)
      await logout()
    }

    /**
     *
     * @description
     * 显示重新登录确认框，由确认回调执行退出。
     */
    const backToSigning = () => {
      window.$dialog.warning({
        title: t('warning'),
        content: t('returnPrompt'),
        positiveText: t('confirm'),
        negativeText: t('cancel'),
        onPositiveClick: toSigningFn,
      })
    }

    let validating = false
    /**
     *
     * @description
     * 校验输入并比较当前缓存密码，成功后解除锁屏；失败保持锁定并显示对应提示。
     */
    const unlockScreen = async () => {
      if (validating) return

      const catchPassword = getStorage<string>(
        APP_CATCH_KEY.appLockScreenPasswordKey,
        'localStorage',
      )

      if (!catchPassword) {
        window.$dialog.warning({
          title: t('warning'),
          content: () => t('passwordChanged'),
          closable: false,
          maskClosable: false,
          closeOnEsc: false,
          positiveText: t('signIn'),
          onPositiveClick: toSigningFn,
        })

        return
      }

      const dCatchPassword = decrypt(catchPassword)

      validating = true

      try {
        try {
          await validate()
        } catch {
          return
        }

        if (dCatchPassword === state.lockCondition.lockPassword) {
          setLockAppScreen(false)
          updateSettingState('lockScreenSwitch', false)
          removeStorage(APP_CATCH_KEY.appLockScreenPasswordKey, 'localStorage')

          state.lockCondition = useCondition()
        } else {
          window.$message.warning(t('wrongPassword'))
        }
      } finally {
        validating = false
      }
    }

    return {
      ...toRefs(state),
      backToSigning,
      unlockScreen,
      isTabletOrSmaller,
      register,
      rules,
      clock,
      t,
    }
  },
  render() {
    const { isTabletOrSmaller } = this
    const { HH_MM, AM_PM, YY_MM_DD, DDD } = this.clock
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
                rules={this.rules}
              >
                <NFormItem path="lockPassword">
                  <NInput
                    autofocus
                    v-model:value={this.lockCondition.lockPassword}
                    type="password"
                    placeholder={this.t('unlockPlaceholder')}
                    clearable
                    minlength={6}
                    onKeydown={(e: KeyboardEvent) => {
                      if (e.key === 'Enter' && !e.isComposing && !e.repeat) {
                        return unlockScreen()
                      }
                    }}
                  />
                </NFormItem>
                <NFlex justify="space-between">
                  <NButton type="primary" text onClick={backToSigning}>
                    {this.t('backToSignIn')}
                  </NButton>
                  <NButton type="primary" text onClick={unlockScreen}>
                    {this.t('unlock')}
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
