import { useI18n, useTheme } from '@/hooks'
import { useSettingGetters } from '@/store'
import { RIcon } from '@ray-template/ui/icon'
import { NSwitch, NTooltip } from 'naive-ui'

export default defineComponent({
  name: 'ThemeSwitch',
  setup() {
    const { t } = useI18n('preferences')
    const { getAppTheme } = useSettingGetters()
    const { lightTheme, darkTheme } = useTheme()

    return () => (
      <NTooltip>
        {{
          trigger: () => (
            <NSwitch
              value={getAppTheme.value}
              aria-label={t('theme.darkMode')}
              onUpdateValue={(dark) => (dark ? darkTheme() : lightTheme())}
            >
              {{
                'checked-icon': () => <RIcon name="system/dark" size={14} />,
                'unchecked-icon': () => <RIcon name="system/light" size={14} />,
                checked: () => t('theme.dark'),
                unchecked: () => t('theme.light'),
              }}
            </NSwitch>
          ),
          default: () => t(getAppTheme.value ? 'theme.dark' : 'theme.light'),
        }}
      </NTooltip>
    )
  },
})
