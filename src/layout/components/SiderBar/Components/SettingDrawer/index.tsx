import './index.scss'
import {
  NDrawer,
  NDrawerContent,
  NDivider,
  NSpace,
  NSwitch,
  NColorPicker,
  NTooltip,
  NDescriptions,
  NDescriptionsItem,
} from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import { useSwatchesColorOptions } from './hook'
import { useSetting } from '@/store'

import type { PropType } from 'vue'

const SettingDrawer = defineComponent({
  name: 'SettingDrawer',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String as PropType<NaiveDrawerPlacement>,
      default: 'right',
    },
    width: {
      type: Number,
      default: 280,
    },
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const settingStore = useSetting()

    const { changeTheme, changePrimaryColor, changeMenuTagLog } = settingStore
    const { themeValue, primaryColorOverride, menuTagLog } =
      storeToRefs(settingStore)

    const modelShow = computed({
      get: () => props.show,
      set: (bool) => {
        emit('update:show', bool)
      },
    })

    const handleRailStyle = () => ({
      backgroundColor: '#000000',
    })

    return {
      modelShow,
      ray: t,
      handleRailStyle,
      changePrimaryColor,
      changeTheme,
      themeValue,
      primaryColorOverride,
      changeMenuTagLog,
      menuTagLog,
    }
  },
  render() {
    return (
      <NDrawer
        v-model:show={this.modelShow}
        placement={this.placement}
        width={this.width}
      >
        <NDrawerContent title={this.ray('LayoutHeaderSettingOptions.Title')}>
          <NSpace class="setting-drawer__space" vertical>
            <NDivider titlePlacement="center">
              {this.ray('LayoutHeaderSettingOptions.ThemeOptions.Title')}
            </NDivider>
            <NSpace justify="center">
              <NTooltip>
                {{
                  trigger: () => (
                    <NSwitch
                      v-model:value={this.themeValue}
                      railStyle={this.handleRailStyle.bind(this)}
                      onUpdateValue={this.changeTheme.bind(this)}
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
                      }}
                    </NSwitch>
                  ),
                  default: () =>
                    this.themeValue
                      ? this.ray('LayoutHeaderSettingOptions.ThemeOptions.Dark')
                      : this.ray(
                          'LayoutHeaderSettingOptions.ThemeOptions.Light',
                        ),
                }}
              </NTooltip>
            </NSpace>
            <NDivider titlePlacement="center">
              {this.ray(
                'LayoutHeaderSettingOptions.ThemeOptions.PrimaryColorConfig',
              )}
            </NDivider>
            <NColorPicker
              swatches={useSwatchesColorOptions()}
              v-model:value={this.primaryColorOverride.common.primaryColor}
              onUpdateValue={this.changePrimaryColor.bind(this)}
            />
            <NDivider titlePlacement="center">界面显示</NDivider>
            <NDescriptions labelPlacement="left" column={1}>
              <NDescriptionsItem label="显示多标签">
                <NSwitch
                  v-model:value={this.menuTagLog}
                  onUpdateValue={this.changeMenuTagLog.bind(this)}
                />
              </NDescriptionsItem>
            </NDescriptions>
          </NSpace>
        </NDrawerContent>
      </NDrawer>
    )
  },
})

export default SettingDrawer
