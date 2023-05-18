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

import { NModal, NInput, NForm, NFormItem, NButton } from 'naive-ui'

import { useSetting } from '@/store'
import { getCache, setCache } from '@/utils/cache'

import type { FormInst } from 'naive-ui'

const LockScreen = defineComponent({
  name: 'LockScreen',
  setup() {
    const formRef = ref<FormInst>()

    const settingStore = useSetting()
    const { lockScreenSwitch, lockScreenInputSwitch } =
      storeToRefs(settingStore)

    const state = reactive({
      lockCondition: {
        pwd: null,
      },
    })
    const rules = {
      pwd: {},
    }
    const isLock =
      getCache('isLockScreen') === 'no' ? false : getCache('isLockScreen')

    return {
      lockScreenSwitch,
      lockScreenInputSwitch,
      rules,
      ...toRefs(state),
      isLock,
    }
  },
  render() {
    return (
      <NModal
        v-model:show={this.lockScreenSwitch}
        transform-origin="center"
        show
        // closeOnEsc={false}
        autoFocus={false}
        maskClosable={false}
        preset={!this.isLock ? 'dialog' : undefined}
        title="锁定屏幕"
      >
        {!this.isLock ? (
          /** 输入界面 */
          <div class="lock-screen__input">
            <NForm model={this.lockCondition} rules={this.rules} inline>
              <NFormItem label="锁屏密码">
                <NInput
                  v-model:value={this.lockCondition.pwd}
                  type="password"
                />
              </NFormItem>
              <NFormItem>
                <NButton type="primary">锁屏</NButton>
              </NFormItem>
            </NForm>
          </div>
        ) : (
          /** 锁屏界面 */
          <div class="lock-screen">
            <div class="lock-screen__content"></div>
          </div>
        )}
      </NModal>
    )
  },
})

export default LockScreen
