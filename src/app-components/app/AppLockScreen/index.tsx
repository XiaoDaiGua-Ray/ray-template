import { RModal } from '@/components'
import LockScreen from './components/LockScreen'

import { useSettingGetters, useSettingActions } from '@/store'

const AppLockScreen = defineComponent({
  name: 'AppLockScreen',
  setup() {
    const { updateSettingState } = useSettingActions()
    const { getLockScreenSwitch } = useSettingGetters()
    const lockScreenSwitchRef = computed({
      get: () => getLockScreenSwitch.value,
      set: (val) => {
        updateSettingState('lockScreenSwitch', val)
      },
    })

    return {
      lockScreenSwitchRef,
    }
  },
  render() {
    return (
      <RModal
        v-model:show={this.lockScreenSwitchRef}
        transformOrigin="center"
        show
        autoFocus={false}
        maskClosable={false}
        closeOnEsc={false}
        preset="dialog"
        title="锁定屏幕"
      >
        <LockScreen />
      </RModal>
    )
  },
})

export default AppLockScreen
