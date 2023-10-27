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
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch/index'

import { APP_THEME } from '@/app-config/designConfig'
import { useSetting } from '@/store'

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
    const settingStore = useSetting()

    const { changePrimaryColor, changeSwitcher, updateContentTransition } =
      settingStore
    const {
      themeValue,
      primaryColorOverride,
      menuTagSwitch,
      breadcrumbSwitch,
      footerSwitch,
      contentTransition,
      watermarkSwitch,
    } = storeToRefs(settingStore)

    const modelShow = computed({
      get: () => props.show,
      set: (bool) => {
        emit('update:show', bool)
      },
    })
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

    return {
      modelShow,
      changePrimaryColor,
      themeValue,
      primaryColorOverride,
      menuTagSwitch,
      changeSwitcher,
      breadcrumbSwitch,
      footerSwitch,
      contentTransitionOptions,
      contentTransition,
      updateContentTransition,
      watermarkSwitch,
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
              v-model:value={this.primaryColorOverride.common!.primaryColor}
              onUpdateValue={this.changePrimaryColor.bind(this)}
            />
            <NDivider titlePlacement="center">
              {$t('headerSettingOptions.ContentTransition')}
            </NDivider>
            <NSelect
              v-model:value={this.contentTransition}
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
                  v-model:value={this.menuTagSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'menuTagSwitch')
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="面包屑">
                <NSwitch
                  v-model:value={this.breadcrumbSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'breadcrumbSwitch')
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="水印">
                <NSwitch
                  v-model:value={this.watermarkSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'watermarkSwitch')
                  }
                />
              </NDescriptionsItem>
              <NDescriptionsItem label="版权信息">
                <NSwitch
                  v-model:value={this.footerSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'footerSwitch')
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
