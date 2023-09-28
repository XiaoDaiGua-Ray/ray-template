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

import { NSpace, NSwitch, NTooltip } from 'naive-ui'
import RayIcon from '@/components/RIcon'

import { useSetting } from '@/store'
import { useI18n } from '@/hooks/web/index'

const ThemeSwitch = defineComponent({
  name: 'ThemeSwitch',
  setup() {
    const { t } = useI18n()
    const settingStore = useSetting()
    const { changeSwitcher } = settingStore
    const { themeValue } = storeToRefs(settingStore)

    const handleRailStyle = ({ checked }: { checked: boolean }) => {
      return checked
        ? {
            backgroundColor: '#000000',
          }
        : {
            color: '#000000',
          }
    }

    return {
      t,
      changeSwitcher,
      themeValue,
      handleRailStyle,
    }
  },
  render() {
    const { t } = this

    return (
      <NSpace justify="center">
        <NTooltip>
          {{
            trigger: () => (
              <NSwitch
                v-model:value={this.themeValue}
                railStyle={this.handleRailStyle.bind(this)}
                onUpdateValue={(bool: boolean) =>
                  this.changeSwitcher(bool, 'themeValue')
                }
              >
                {{
                  'checked-icon': () =>
                    h(
                      RayIcon,
                      {
                        name: 'dark',
                      },
                      {},
                    ),
                  'unchecked-icon': () =>
                    h(
                      RayIcon,
                      {
                        name: 'light',
                      },
                      {},
                    ),
                  checked: () => '亮',
                  unchecked: () => '暗',
                }}
              </NSwitch>
            ),
            default: () =>
              this.themeValue
                ? t('headerSettingOptions.ThemeOptions.Dark')
                : t('headerSettingOptions.ThemeOptions.Light'),
          }}
        </NTooltip>
      </NSpace>
    )
  },
})

export default ThemeSwitch
