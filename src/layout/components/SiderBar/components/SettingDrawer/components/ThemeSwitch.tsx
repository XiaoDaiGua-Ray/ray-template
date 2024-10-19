import { NFlex, NSwitch, NTooltip } from 'naive-ui'
import { RIcon } from '@/components'

import { useSettingGetters } from '@/store'
import { useTheme } from '@/hooks'

export default defineComponent({
  name: 'ThemeSwitch',
  setup() {
    const { darkTheme, lightTheme } = useTheme()
    const { getAppTheme } = useSettingGetters()
    const modelAppThemeRef = ref(getAppTheme.value)

    const railStyle = ({ checked }: { checked: boolean }) => {
      return checked
        ? {
            backgroundColor: '#000000',
          }
        : {
            color: '#000000',
          }
    }

    return {
      darkTheme,
      lightTheme,
      getAppTheme,
      railStyle,
      modelAppThemeRef,
    }
  },
  render() {
    const { $t, darkTheme, lightTheme, railStyle } = this

    return (
      <NFlex justify="center">
        <NTooltip>
          {{
            trigger: () => (
              <NSwitch
                v-model:value={this.modelAppThemeRef}
                railStyle={railStyle.bind(this)}
                onUpdateValue={(bool: boolean) =>
                  bool ? darkTheme() : lightTheme()
                }
              >
                {{
                  'checked-icon': () => <RIcon name="dark" />,
                  'unchecked-icon': () => <RIcon name="light" />,
                  checked: () => '亮',
                  unchecked: () => '暗',
                }}
              </NSwitch>
            ),
            default: () =>
              this.getAppTheme
                ? $t('headerSettingOptions.ThemeOptions.Dark')
                : $t('headerSettingOptions.ThemeOptions.Light'),
          }}
        </NTooltip>
      </NFlex>
    )
  },
})
