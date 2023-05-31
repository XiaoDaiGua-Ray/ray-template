/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-13
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NModal, NInput, NForm, NFormItem, NButton, NSpace } from 'naive-ui'
import AppAvatar from '@/components/AppComponents/AppAvatar/index'

import { useSetting, useSignin } from '@/store'
import { getCache, setCache } from '@/utils/cache'
import dayjs from 'dayjs'
import { APP_CATCH_KEY } from '@/appConfig/appConfig'

import type { FormInst, InputInst } from 'naive-ui'

const LockScreen = defineComponent({
  name: 'LockScreen',
  setup() {
    const formRef = ref<FormInst>()
    const inputInstRef = ref<InputInst>()

    const settingStore = useSetting()
    const signinStore = useSignin()
    /** lockScreenSwitch 检测是否激活锁屏弹窗 */
    const { lockScreenSwitch, lockScreenInputSwitch } =
      storeToRefs(settingStore)
    const { changeSwitcher } = settingStore
    const { logout } = signinStore

    const TIME_FORMAT = 'HH:mm'
    const AM_PM_FORMAT = 'A'
    const YEAR_FORMAT = 'YY-MM-DD'
    const DATE_FORMAT = 'dddd'

    const state = reactive({
      lockCondition: {
        pwd: null,
      },
      time: dayjs().format(TIME_FORMAT),
      second: dayjs().locale('en').format(AM_PM_FORMAT),
      year: dayjs().format(YEAR_FORMAT),
      date: dayjs().format(DATE_FORMAT),
    })
    const rules = {
      pwd: {
        required: true,
        message: '请输入正确格式密码',
        min: 6,
        max: 12,
        trigger: ['input', 'blur'],
      },
    }
    /** 检测是否处于锁屏状态 */
    const isLock = useStorage('isLockScreen', false, sessionStorage, {
      mergeDefaults: true,
    })
    const signin = getCache(APP_CATCH_KEY.signin)

    const handleLockScreen = () => {
      formRef.value?.validate((error) => {
        if (!error) {
          isLock.value = true
          state.lockCondition.pwd = null

          setCache('lockScreenPassword', state.lockCondition.pwd)
          changeSwitcher(true, 'lockScreenSwitch')
        }
      })
    }

    const dayInterval = setInterval(() => {
      state.time = dayjs().format(TIME_FORMAT)
      state.second = dayjs().format(AM_PM_FORMAT)
    }, 60_000)
    const yearInterval = setInterval(() => {
      state.year = dayjs().format(YEAR_FORMAT)
      state.date = dayjs().format(DATE_FORMAT)
    }, 86_400_000)

    const handleBackToSignin = () => {
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

    const handleUnlockScreen = () => {
      formRef.value?.validate((error) => {
        if (!error) {
          isLock.value = false
          state.lockCondition.pwd = null

          changeSwitcher(false, 'lockScreenSwitch')
        }
      })
    }

    /** 当弹窗出现后, 自动聚焦密码输入框 */
    const handleModalUpdateShow = () => {
      nextTick(() => {
        inputInstRef.value?.focus()
      })
    }

    onBeforeUnmount(() => {
      clearInterval(dayInterval)
      clearInterval(yearInterval)
    })

    return {
      lockScreenSwitch,
      lockScreenInputSwitch,
      rules,
      ...toRefs(state),
      isLock,
      handleLockScreen,
      formRef,
      signin,
      handleBackToSignin,
      handleUnlockScreen,
      inputInstRef,
      handleModalUpdateShow,
    }
  },
  render() {
    return (
      <NModal
        v-model:show={this.lockScreenSwitch}
        transform-origin="center"
        show
        maskClosable={false}
        closeOnEsc={false}
        preset={!this.isLock ? 'dialog' : undefined}
        title="锁定屏幕"
        onAfterEnter={this.handleModalUpdateShow.bind(this)}
      >
        {!this.isLock ? (
          /** 输入界面 */
          <div class="lock-screen__input">
            <AppAvatar vertical align="center" avatarSize={52} />
            <NForm
              ref="formRef"
              model={this.lockCondition}
              rules={this.rules}
              labelPlacement="left"
              style={{
                margin: '24px 0',
              }}
            >
              <NFormItem path="pwd">
                <NInput
                  v-model:value={this.lockCondition.pwd}
                  type="password"
                  placeholder="请输入锁屏密码"
                  clearable
                  minlength={6}
                  maxlength={12}
                  ref="inputInstRef"
                />
              </NFormItem>
              <NButton
                type="primary"
                onClick={this.handleLockScreen.bind(this)}
                style={{
                  width: '100%',
                }}
              >
                锁屏
              </NButton>
            </NForm>
          </div>
        ) : (
          /** 锁屏界面 */
          <div class="lock-screen">
            <div class="lock-screen__content">
              <div class="lock-screen__content-bg">
                <div class="left">{this.time?.split(':')[0]}</div>
                <div class="right">{this.time?.split(':')[1]}</div>
              </div>
              <div class="lock-screen__content-avatar">
                <AppAvatar vertical align="center" avatarSize={52} />
              </div>
              <div class="lock-screen__content-input">
                <NForm
                  ref="formRef"
                  model={this.lockCondition}
                  rules={this.rules}
                >
                  <NFormItem path="pwd">
                    <NInput
                      v-model:value={this.lockCondition.pwd}
                      type="password"
                      placeholder="请输入解锁密码"
                      clearable
                      minlength={6}
                      maxlength={12}
                      ref="inputInstRef"
                    />
                  </NFormItem>
                  <NSpace justify="space-between">
                    <NButton
                      type="primary"
                      text
                      onClick={this.handleBackToSignin.bind(this)}
                    >
                      返回登陆
                    </NButton>
                    <NButton
                      type="primary"
                      text
                      onClick={this.handleUnlockScreen.bind(this)}
                    >
                      进入系统
                    </NButton>
                  </NSpace>
                </NForm>
              </div>
              <div class="lock-screen__content-date">
                <div class="current-date">
                  {this.time}&nbsp;<span>{this.second}</span>
                </div>
                <div class="current-year">
                  {this.year}&nbsp;{this.date}
                </div>
              </div>
            </div>
          </div>
        )}
      </NModal>
    )
  },
})

export default LockScreen
