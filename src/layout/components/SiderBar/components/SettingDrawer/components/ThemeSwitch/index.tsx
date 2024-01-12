/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NFlex, NSwitch, NTooltip } from 'naive-ui'
import { RIcon } from '@/components'

import { useSettingGetters } from '@/store'
import { useTheme } from '@/hooks'

export default defineComponent({
  name: 'ThemeSwitch',
  setup() {
    const { changeDarkTheme, changeLightTheme } = useTheme()
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
      changeDarkTheme,
      changeLightTheme,
      getAppTheme,
      railStyle,
      modelAppThemeRef,
    }
  },
  render() {
    const { $t, changeDarkTheme, changeLightTheme, railStyle } = this

    return (
      <NFlex justify="center">
        <NTooltip>
          {{
            trigger: () => (
              <NSwitch
                v-model:value={this.modelAppThemeRef}
                railStyle={railStyle.bind(this)}
                onUpdateValue={(bool: boolean) =>
                  bool ? changeDarkTheme() : changeLightTheme()
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
