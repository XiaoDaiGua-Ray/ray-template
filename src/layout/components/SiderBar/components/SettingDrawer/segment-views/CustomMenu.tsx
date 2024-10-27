import {
  NFlex,
  NFormItem,
  NDivider,
  NSwitch,
  NForm,
  NTooltip,
  NText,
  NInputNumber,
  NButton,
} from 'naive-ui'
import { RIcon } from '@/components'

import { SETTING_DRAWER_INJECT_KEY } from '../constant'
import { useSettingActions } from '@/store'

export default defineComponent({
  name: 'SegmentViewsCustomMenu',
  setup() {
    const model = inject(SETTING_DRAWER_INJECT_KEY, {})
    const { updateSettingState } = useSettingActions()

    return {
      model,
      updateSettingState,
    }
  },
  render() {
    const { model, updateSettingState } = this

    return (
      <NFlex vertical style="width: 100%;" size={[0, 0]}>
        <NDivider titlePlacement="center">
          <NFlex wrap={false} align="center" size={[4, 0]}>
            <NTooltip placement="top" showArrow={false}>
              {{
                trigger: () => <RIcon name="question" size="16" />,
                default: () =>
                  '菜单更新是一个复杂、耗时的操作，请手动点击【更新菜单】按钮更新设置',
              }}
            </NTooltip>
            <NText>菜单样式</NText>
          </NFlex>
        </NDivider>
        <NForm
          showFeedback={true}
          showRequireMark={false}
          class="setting-drawer__overrides-form"
        >
          <NFormItem label="每级菜单缩进">
            <NInputNumber
              v-model:value={model.menuConfig!.collapsedIndent}
              min={0}
              precision={0}
              onUpdateValue={(value) =>
                updateSettingState('menuConfig', {
                  collapsedIndent: value!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="菜单图标尺寸">
            <NInputNumber
              v-model:value={model.menuConfig!.iconSize}
              min={0}
              precision={0}
              onUpdateValue={(value) =>
                updateSettingState('menuConfig', {
                  iconSize: value!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="折叠菜单图标尺寸">
            <NInputNumber
              v-model:value={model.menuConfig!.collapsedIconSize}
              min={0}
              precision={0}
              onUpdateValue={(value) =>
                updateSettingState('menuConfig', {
                  collapsedIconSize: value!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="菜单宽度">
            <NInputNumber
              v-model:value={model.menuConfig!.menuWidth}
              min={0}
              precision={0}
              onUpdateValue={(value) =>
                updateSettingState('menuConfig', {
                  menuWidth: value!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="折叠菜单宽度">
            <NInputNumber
              v-model:value={model.menuConfig!.collapsedWidth}
              min={0}
              precision={0}
              onUpdateValue={(value) =>
                updateSettingState('menuConfig', {
                  collapsedWidth: value!,
                })
              }
            />
          </NFormItem>
          <NFormItem showFeedback={false} showLabel={false}>
            <NButton onClick={model.throttleSetupAppMenu} block type="primary">
              更新菜单
            </NButton>
          </NFormItem>
        </NForm>
        <NDivider>其他设置</NDivider>
        <NForm
          showFeedback={false}
          showRequireMark={false}
          class="setting-drawer__overrides-form"
          labelPlacement="left"
        >
          <NFormItem label="反转色菜单">
            <NSwitch
              v-model:value={model.menuConfig!.inverted}
              onUpdateValue={(bool) =>
                updateSettingState('menuConfig', {
                  inverted: bool,
                })
              }
            />
          </NFormItem>
          <NFormItem label="菜单标题">
            <NSwitch
              v-model:value={model.menuConfig!.menuSiderBarLogo}
              onUpdateValue={(bool) =>
                updateSettingState('menuConfig', {
                  menuSiderBarLogo: bool,
                })
              }
            />
          </NFormItem>
          <NFormItem label="手风琴菜单">
            <NSwitch
              v-model:value={model.menuConfig!.accordion}
              onUpdateValue={(bool) =>
                updateSettingState('menuConfig', {
                  accordion: bool,
                })
              }
            />
          </NFormItem>
          <NFormItem label="原生滚动条">
            <NSwitch
              v-model:value={model.menuConfig!.nativeScrollbar}
              onUpdateValue={(bool) =>
                updateSettingState('menuConfig', {
                  nativeScrollbar: bool,
                })
              }
            />
          </NFormItem>
        </NForm>
      </NFlex>
    )
  },
})
