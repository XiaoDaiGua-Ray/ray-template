import { RModal } from '@/components'
import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import LockScreen from './components/LockScreen'

const AppLockScreen = defineComponent({
  name: 'AppLockScreen',
  setup() {
    const { t } = useI18n('appComponents.lockScreen')
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
      t,
    }
  },
  render() {
    return (
      <RModal
        v-model:show={this.lockScreenSwitchRef}
        transformOrigin="center"
        autoFocus={false}
        maskClosable={false}
        closeOnEsc={false}
        preset="dialog"
        title={this.t('title')}
      >
        <LockScreen />
      </RModal>
    )
  },
})

export default AppLockScreen
