import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import { LayoutSettings } from '@ray-template/admin-shell'

export default defineComponent({
  name: 'LayoutSettings',
  props: { showDescription: Boolean },
  setup(props) {
    const { t } = useI18n('layout')
    const { getLayoutConfig } = useSettingGetters()
    const { updateSettingState } = useSettingActions()

    return () => (
      <LayoutSettings
        showDescription={props.showDescription}
        layout={getLayoutConfig.value}
        defaults={getDefaultSettingConfig().layoutConfig}
        translate={t}
        update={(value) => updateSettingState('layoutConfig', value)}
      />
    )
  },
})
