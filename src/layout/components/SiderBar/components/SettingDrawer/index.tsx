/**
 *
 * app setting 抽屉
 * 提供了一些基础的动态配置能力
 * 如果需要其他额外的配置项，可以按照当前的方式进行拓展
 *
 * 可能会疑问，为什么可配置项那么少？
 * 其实并不少，只是有一些东西，在我看来是没多大意义需要动态的去改动的，所以都是在 `app-config` 包中进行配置维护
 */

import './index.scss'

import {
  NDrawer,
  NDrawerContent,
  NDivider,
  NSpace,
  NSwitch,
  NColorPicker,
  NDescriptions,
  NDescriptionsItem,
  NSelect,
} from 'naive-ui'
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch'

import { APP_THEME } from '@/app-config/designConfig'
import { useSettingGetters, useSettingActions } from '@/store'

import type { PropType } from 'vue'
import type { Placement } from '@/types/modules/component'

const SettingDrawer = defineComponent({
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
    const { changePrimaryColor, changeSwitcher, updateContentTransition } =
      useSettingActions()
    const {
      getAppTheme,
      getPrimaryColorOverride,
      getMenuTagSwitch,
      getBreadcrumbSwitch,
      getCopyrightSwitch,
      getContentTransition,
      getWatermarkSwitch,
    } = useSettingGetters()

    const modelShow = computed({
      get: () => props.show,
      set: (bool) => {
        emit('update:show', bool)
      },
    })
    // 过渡效果下拉
    const contentTransitionOptions = [
      {
        label: '无',
        value: 'none',
      },
      {
        label: '缩放效果',
        value: 'scale',
      },
      {
        label: '淡入淡出',
        value: 'fade',
      },
      {
        label: '闪入效果',
        value: 'opacity',
      },
    ]
    const modelSwitchReactive = reactive({
      getMenuTagSwitch: getMenuTagSwitch.value,
      getBreadcrumbSwitch: getBreadcrumbSwitch.value,
      getCopyrightSwitch: getCopyrightSwitch.value,
      getContentTransition: getContentTransition.value,
      getWatermarkSwitch: getWatermarkSwitch.value,
    })

    return {
      modelShow,
      changePrimaryColor,
      getAppTheme,
      getPrimaryColorOverride,
      changeSwitcher,
      contentTransitionOptions,
      updateContentTransition,
      modelSwitchReactive,
    }
  },
  render() {
    const { $t } = this

    return (
      <NDrawer
        v-model:show={this.modelShow}
        placement={this.placement}
        width={this.width}
      >
        <NDrawerContent title={$t('headerSettingOptions.Title')}>
          <NSpace class="setting-drawer__space" vertical>
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ThemeOptions.Title')}
            </NDivider>
            <ThemeSwitch />
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ThemeOptions.PrimaryColorConfig')}
            </NDivider>
            <NColorPicker
              swatches={APP_THEME.appThemeColors}
              v-model:value={this.getPrimaryColorOverride.common!.primaryColor}
              onUpdateValue={this.changePrimaryColor.bind(this)}
            />
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ContentTransition')}
            </NDivider>
            <NSelect
              v-model:value={this.modelSwitchReactive.getContentTransition}
              options={this.contentTransitionOptions}
              onUpdateValue={(value) => {
                this.updateContentTransition(value)
              }}
            />
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.InterfaceDisplay')}
            </NDivider>
            <NDescriptions labelPlacement="left" column={1}>
              <NDescriptionsItem label="多标签">
                <NSwitch
                  v-model:value={this.modelSwitchReactive.getMenuTagSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'menuTagSwitch')
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="面包屑">
                <NSwitch
                  v-model:value={this.modelSwitchReactive.getBreadcrumbSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'breadcrumbSwitch')
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="水印">
                <NSwitch
                  v-model:value={this.modelSwitchReactive.getWatermarkSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'watermarkSwitch')
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="版权信息">
                <NSwitch
                  v-model:value={this.modelSwitchReactive.getCopyrightSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'copyrightSwitch')
                  }
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
