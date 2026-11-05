import { RIcon, RSegment } from '@/components'
import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import type { SettingState } from '@/store/modules/setting/types'

export default defineComponent({
  name: 'ThemeSegment',
  setup() {
    const { t } = useI18n('preferences')
    const { getAppThemeStr } = useSettingGetters()
    const { updateSettingState } = useSettingActions()
    const options = computed(() => [
      {
        label: t('theme.dark'),
        key: 'dark',
        icon: () => <RIcon name="system/dark" size="16" />,
      },
      {
        label: t('theme.light'),
        key: 'light',
        icon: () => <RIcon name="system/light" size="16" />,
      },
      {
        label: t('theme.auto'),
        key: 'auto',
        icon: () => <RIcon name="system/system_os" size="16" />,
      },
    ])
    const modelAppTheme = computed({
      get: () => getAppThemeStr.value,
      set: (value: SettingState['appTheme']) =>
        updateSettingState('appTheme', value),
    })

    return {
      options,
      modelAppTheme,
    }
  },
  render() {
    const { options } = this

    return (
      <RSegment
        options={options}
        size="small"
        width="block"
        v-model:value={this.modelAppTheme}
      />
    )
  },
})
