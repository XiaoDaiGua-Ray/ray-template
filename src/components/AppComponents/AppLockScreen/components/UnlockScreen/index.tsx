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

/** 解锁界面 */

import { NInput, NForm, NFormItem, NButton, NSpace } from 'naive-ui'
import AppAvatar from '@/components/AppComponents/AppAvatar/index'

import dayjs from 'dayjs'
import { useSetting, useSignin } from '@/store'
import {
  rules,
  useCondition,
  autoFouceInput,
} from '@/components/AppComponents/AppLockScreen/hook'
import useAppLockScreen from '@/components/AppComponents/AppLockScreen/appLockVar'

import type { FormInst, InputInst } from 'naive-ui'

const UnlockScreen = defineComponent({
  name: 'UnlockScreen',
  setup() {
    const formRef = ref<FormInst | null>(null)
    const inputInstRef = ref<InputInst | null>(null)

    const { logout } = useSignin()
    const { changeSwitcher } = useSetting()
    const { setLockAppScreen } = useAppLockScreen()

    const HH_MM_FORMAT = 'HH:mm'
    const AM_PM_FORMAT = 'A'
    const YY_MM_DD_FORMAT = 'YY年MM月DD日'
    const DDD_FORMAT = 'ddd'

    const state = reactive({
      lockCondition: useCondition(),
      HH_MM: dayjs().format(HH_MM_FORMAT),
      AM_PM: dayjs().locale('en').format(AM_PM_FORMAT),
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

    /** 退出登陆并且回到登陆页 */
    const backToSignin = () => {
      window.$dialog.warning({
        title: '警告',
        content: '是否返回到登陆页?',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          logout()
          setTimeout(() => {
            changeSwitcher(false, 'lockScreenSwitch')
          })
        },
      })
    }

    /** 解锁 */
    const unlockScreen = () => {
      formRef.value?.validate((error) => {
        if (!error) {
          setLockAppScreen(false)
          changeSwitcher(false, 'lockScreenSwitch')

          state.lockCondition = useCondition()
        }
      })
    }

    onBeforeUnmount(() => {
      clearInterval(dayInterval)
      clearInterval(yearInterval)
    })

    return {
      ...toRefs(state),
      backToSignin,
      unlockScreen,
      formRef,
      inputInstRef,
    }
  },
  render() {
    return (
      <div class="app-lock-screen__unlock">
        <div class="app-lock-screen__unlock__content">
          <div class="app-lock-screen__unlock__content-bg">
            <div class="left">{this.HH_MM?.split(':')[0]}</div>
            <div class="right">{this.HH_MM?.split(':')[1]}</div>
          </div>
          <div class="app-lock-screen__unlock__content-avatar">
            <AppAvatar vertical align="center" avatarSize={52} />
          </div>
          <div class="app-lock-screen__unlock__content-input">
            <NForm ref="formRef" model={this.lockCondition} rules={rules}>
              <NFormItem path="lockPassword">
                <NInput
                  ref="inputInstRef"
                  v-model:value={this.lockCondition.lockPassword}
                  type="password"
                  placeholder="请输入解锁密码"
                  clearable
                  minlength={6}
                  maxlength={12}
                />
              </NFormItem>
              <NSpace justify="space-between">
                <NButton
                  type="primary"
                  text
                  onClick={this.backToSignin.bind(this)}
                >
                  返回登陆
                </NButton>
                <NButton
                  type="primary"
                  text
                  onClick={this.unlockScreen.bind(this)}
                >
                  进入系统
                </NButton>
              </NSpace>
            </NForm>
          </div>
          <div class="app-lock-screen__unlock__content-date">
            <div class="current-date">
              {this.HH_MM}&nbsp;<span>{this.AM_PM}</span>
            </div>
            <div class="current-year">
              {this.YY_MM_DD}&nbsp;<span>{this.DDD}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
})

export default UnlockScreen
