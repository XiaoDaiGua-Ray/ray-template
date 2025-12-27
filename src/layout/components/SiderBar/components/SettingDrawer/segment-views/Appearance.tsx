import { APP_THEME, CONTENT_TRANSITION_OPTIONS } from '@/app-config'
import { useSettingActions } from '@/store'
import {
  NColorPicker,
  NDivider,
  NFlex,
  NForm,
  NFormItem,
  NSelect,
  NSwitch,
} from 'naive-ui'
import ThemeSegment from '../components/ThemeSegment'
import { SETTING_DRAWER_INJECT_KEY } from '../constant'

export default defineComponent({
  name: 'SegmentViewsAppearance',
  setup() {
    const model = inject(SETTING_DRAWER_INJECT_KEY, {})
    const { changePrimaryColor, updateSettingState, toggleColorWeakness } =
      useSettingActions()

    return {
      toggleColorWeakness,
      model,
      changePrimaryColor,
      updateSettingState,
    }
  },
  render() {
    const {
      toggleColorWeakness,
      model,
      changePrimaryColor,
      updateSettingState,
    } = this

    return (
      <NFlex vertical style="width: 100%;" size={[0, 0]}>
        <NDivider>系统主题</NDivider>
        <ThemeSegment />
        <NDivider>内置主题</NDivider>
        <NColorPicker
          showPreview
          swatches={APP_THEME.appThemeColors}
          v-model:value={model.primaryColorOverride!.common!.primaryColor}
          onUpdateValue={changePrimaryColor.bind(this)}
        />
        <NDivider>切换动画</NDivider>
        <NSelect
          v-model:value={model.contentTransition}
          options={CONTENT_TRANSITION_OPTIONS}
          onUpdateValue={(value) => {
            updateSettingState('contentTransition', value)
          }}
        />
        <NDivider>配置入口出现位置</NDivider>
        <NSelect
          v-model:value={model.drawerPlacement}
          options={[
            {
              label: '右边',
              value: 'right',
            },
            {
              label: '左边',
              value: 'left',
            },
          ]}
          onUpdateValue={(value) => {
            updateSettingState('drawerPlacement', value)
          }}
        />
        <NDivider>其他设置</NDivider>
        <NForm
          labelPlacement="left"
          class="setting-drawer__overrides-form"
          showFeedback={false}
        >
          <NFormItem label="面包屑">
            <NSwitch
              v-model:value={model.breadcrumbSwitch}
              onUpdateValue={(bool) =>
                updateSettingState('breadcrumbSwitch', bool)
              }
            />
          </NFormItem>
          <NFormItem label="标签页">
            <NSwitch
              v-model:value={model.menuTagSwitch}
              onUpdateValue={(bool) =>
                updateSettingState('menuTagSwitch', bool)
              }
            />
          </NFormItem>
          <NFormItem label="页底信息">
            <NSwitch
              v-model:value={model.copyrightSwitch}
              onUpdateValue={(bool) =>
                updateSettingState('copyrightSwitch', bool)
              }
            />
          </NFormItem>
          <NFormItem label="色弱模式">
            <NSwitch
              v-model:value={model.colorWeakness}
              onUpdateValue={(bool) => {
                updateSettingState('colorWeakness', bool)
                toggleColorWeakness(bool)
              }}
            />
          </NFormItem>
        </NForm>
      </NFlex>
    )
  },
})
