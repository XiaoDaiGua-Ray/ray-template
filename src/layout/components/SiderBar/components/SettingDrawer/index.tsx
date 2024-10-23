import './index.scss'

import {
  NDrawer,
  NDrawerContent,
  NDivider,
  NFlex,
  NSwitch,
  NColorPicker,
  NDescriptions,
  NDescriptionsItem,
  NSelect,
  NInputNumber,
  NFormItem,
  NForm,
  NButton,
  NText,
  NTooltip,
} from 'naive-ui'
import ThemeSegment from './components/ThemeSegment'
import { RIcon } from '@/components'

import { APP_THEME, CONTENT_TRANSITION_OPTIONS } from '@/app-config'
import { useSettingGetters, useSettingActions } from '@/store'
import { defaultSettingConfig } from './constant'
import { forIn } from 'lodash-es'

import type { PropType } from 'vue'
import type { Placement } from '@/types'
import type { SettingState } from '@/store/modules/setting/types'

export default defineComponent({
  name: 'SettingDrawer',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    placement: {
      type: String as PropType<Placement>,
      default: 'right',
    },
    width: {
      type: Number,
      default: 280,
    },
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const { changePrimaryColor, updateSettingState } = useSettingActions()
    const {
      getAppTheme,
      getPrimaryColorOverride,
      getMenuTagSwitch,
      getBreadcrumbSwitch,
      getCopyrightSwitch,
      getContentTransition,
      getWatermarkSwitch,
      getKeepAliveConfig,
      getMenuConfig,
      getDrawerPlacement,
    } = useSettingGetters()

    const modelShow = computed({
      get: () => props.show,
      set: (bool) => {
        emit('update:show', bool)
      },
    })
    // 为了方便管理多个 computed，因为 computed 不能被逆向修改
    const modelReactive = computed({
      get: () => {
        return {
          getMenuTagSwitch: getMenuTagSwitch.value,
          getBreadcrumbSwitch: getBreadcrumbSwitch.value,
          getCopyrightSwitch: getCopyrightSwitch.value,
          getContentTransition: getContentTransition.value,
          getWatermarkSwitch: getWatermarkSwitch.value,
          getKeepAliveConfig: getKeepAliveConfig.value,
          getMenuConfig: getMenuConfig.value,
          getDrawerPlacement: getDrawerPlacement.value,
        }
      },
      set: (value) => {},
    })

    const defaultSettingBtnClick = () => {
      forIn(defaultSettingConfig, (value, key) => {
        updateSettingState(key as keyof SettingState, value)
      })
    }

    return {
      modelShow,
      changePrimaryColor,
      getAppTheme,
      getPrimaryColorOverride,
      updateSettingState,
      modelReactive,
      defaultSettingBtnClick,
    }
  },
  render() {
    const {
      $t,
      changePrimaryColor,
      updateSettingState,
      defaultSettingBtnClick,
    } = this

    return (
      <NDrawer
        v-model:show={this.modelShow}
        placement={this.placement}
        width={this.width}
        trapFocus={false}
        autoFocus={false}
      >
        <NDrawerContent title="系统配置">
          <NFlex class="setting-drawer__space" vertical>
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ThemeOptions.Title')}
            </NDivider>
            <ThemeSegment />
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ThemeOptions.PrimaryColorConfig')}
            </NDivider>
            <NColorPicker
              swatches={APP_THEME.appThemeColors}
              v-model:value={this.getPrimaryColorOverride.common!.primaryColor}
              onUpdateValue={changePrimaryColor.bind(this)}
            />
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ContentTransition')}
            </NDivider>
            <NSelect
              v-model:value={this.modelReactive.getContentTransition}
              options={CONTENT_TRANSITION_OPTIONS}
              onUpdateValue={(value) => {
                updateSettingState('contentTransition', value)
              }}
            />
            <NDivider titlePlacement="center">抽屉位置</NDivider>
            <NSelect
              v-model:value={this.modelReactive.getDrawerPlacement}
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
            <NDivider titlePlacement="center">系统设置</NDivider>
            <NDescriptions labelPlacement="left" column={1}>
              <NDescriptionsItem label="菜单页头">
                <NSwitch
                  v-model:value={
                    this.modelReactive.getMenuConfig.menuSiderBarLogo
                  }
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('menuConfig', {
                      menuSiderBarLogo: bool,
                    })
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="菜单手风琴">
                <NSwitch
                  v-model:value={this.modelReactive.getMenuConfig.accordion}
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('menuConfig', {
                      accordion: bool,
                    })
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="页面缓存">
                <NSwitch
                  v-model:value={
                    this.modelReactive.getKeepAliveConfig.setupKeepAlive
                  }
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('keepAliveConfig', {
                      setupKeepAlive: bool,
                    })
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="多标签">
                <NSwitch
                  v-model:value={this.modelReactive.getMenuTagSwitch}
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('menuTagSwitch', bool)
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="面包屑">
                <NSwitch
                  v-model:value={this.modelReactive.getBreadcrumbSwitch}
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('breadcrumbSwitch', bool)
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="水印">
                <NSwitch
                  v-model:value={this.modelReactive.getWatermarkSwitch}
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('watermarkSwitch', bool)
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="页底信息">
                <NSwitch
                  v-model:value={this.modelReactive.getCopyrightSwitch}
                  onUpdateValue={(bool: boolean) =>
                    updateSettingState('copyrightSwitch', bool)
                  }
                />
              </NDescriptionsItem>
            </NDescriptions>
            <NDivider titlePlacement="center">菜单样式</NDivider>
            <NForm showFeedback={true} showRequireMark={false}>
              <NFormItem label="每级菜单缩进">
                <NInputNumber
                  v-model:value={
                    this.modelReactive.getMenuConfig.collapsedIndent
                  }
                  min={0}
                  precision={0}
                  onUpdateValue={(value) => {
                    if (value !== null) {
                      updateSettingState('menuConfig', {
                        collapsedIndent: value,
                      })
                    }
                  }}
                />
              </NFormItem>
              <NFormItem label="菜单图标尺寸">
                <NInputNumber
                  v-model:value={this.modelReactive.getMenuConfig.iconSize}
                  min={0}
                  precision={0}
                  onUpdateValue={(value) => {
                    if (value !== null) {
                      updateSettingState('menuConfig', {
                        iconSize: value,
                      })
                    }
                  }}
                />
              </NFormItem>
              <NFormItem label="折叠菜单图标尺寸">
                <NInputNumber
                  v-model:value={
                    this.modelReactive.getMenuConfig.collapsedIconSize
                  }
                  min={0}
                  precision={0}
                  onUpdateValue={(value) => {
                    if (value !== null) {
                      updateSettingState('menuConfig', {
                        collapsedIconSize: value,
                      })
                    }
                  }}
                />
              </NFormItem>
              <NFormItem label="折叠菜单宽度" showFeedback={false}>
                <NInputNumber
                  v-model:value={
                    this.modelReactive.getMenuConfig.collapsedWidth
                  }
                  min={0}
                  precision={0}
                  onUpdateValue={(value) => {
                    if (value !== null) {
                      updateSettingState('menuConfig', {
                        collapsedWidth: value,
                      })
                    }
                  }}
                />
              </NFormItem>
            </NForm>
            <NDivider titlePlacement="center">
              <NFlex wrap={false} align="center" size={[4, 0]}>
                <NTooltip placement="top" showArrow={false}>
                  {{
                    trigger: () => <RIcon name="question" size="16" />,
                    default: () => '当设置为【0】时，缓存将会失效',
                  }}
                </NTooltip>
                <NText>最大缓存数</NText>
              </NFlex>
            </NDivider>
            <NInputNumber
              v-model:value={
                this.modelReactive.getKeepAliveConfig.maxKeepAliveLength
              }
              showButton={true}
              min={0}
              max={100}
              precision={0}
              disabled={!this.modelReactive.getKeepAliveConfig.setupKeepAlive}
            />
            <NDivider titlePlacement="center">操作</NDivider>
            <NFlex>
              <NButton type="primary" block onClick={defaultSettingBtnClick}>
                清除设置
              </NButton>
            </NFlex>
          </NFlex>
        </NDrawerContent>
      </NDrawer>
    )
  },
})
