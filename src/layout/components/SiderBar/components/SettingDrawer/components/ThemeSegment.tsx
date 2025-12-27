import { RIcon, RSegment } from '@/components'
import { useSettingActions, useSettingGetters } from '@/store'
import type { SettingState } from '@/store/modules/setting/types'
import { useColorMode } from '@vueuse/core'

export default defineComponent({
  name: 'ThemeSegment',
  setup() {
    const { system } = useColorMode()
    const { getAppThemeStr, getAppTheme } = useSettingGetters()
    const { updateSettingState } = useSettingActions()
    const options = [
      {
        label: '深色',
        key: 'dark',
        icon: () => <RIcon name="dark" size="16" />,
      },
      {
        label: '浅色',
        key: 'light',
        icon: () => <RIcon name="light" size="16" />,
      },
      {
        label: '自动',
        key: 'auto',
        icon: () => <RIcon name="system_os" size="16" />,
      },
    ]
    const modelAppTheme = computed({
      get: () => {
        if (getAppThemeStr.value === 'auto') {
          return 'auto'
        }

        return getAppTheme.value ? 'dark' : 'light'
      },
      set: (val) => {
        updateThemeFn(val, system.value)
      },
    })

    const updateThemeFn = (
      themeModel: SettingState['appTheme'],
      systemTheme: 'dark' | 'light',
    ) => {
      if (themeModel === 'auto') {
        updateSettingState('_appTheme', systemTheme === 'dark')
        updateSettingState('appTheme', 'auto')

        return
      }

      updateSettingState('_appTheme', themeModel === 'dark')
      updateSettingState('appTheme', themeModel)
    }

    watchEffect(() => {
      updateThemeFn(modelAppTheme.value, system.value)
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
