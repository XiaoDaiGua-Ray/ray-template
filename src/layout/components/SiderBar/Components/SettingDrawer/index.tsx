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
} from 'naive-ui'
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch/index'

import { useSwatchesColorOptions } from './hook'
import { useSetting } from '@/store'
import { useI18n } from '@/locales/useI18n'

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

    const { changePrimaryColor, changeSwitcher } = settingStore
    const {
      themeValue,
      primaryColorOverride,
      menuTagSwitch,
      breadcrumbSwitch,
      invertSwitch,
    } = storeToRefs(settingStore)

    const modelShow = computed({
      get: () => props.show,
      set: (bool) => {
        emit('update:show', bool)
      },
    })

    return {
      modelShow,
      t,
      changePrimaryColor,
      themeValue,
      primaryColorOverride,
      menuTagSwitch,
      changeSwitcher,
      breadcrumbSwitch,
      invertSwitch,
    }
  },
  render() {
    const { t } = this

    return (
      <NDrawer
        v-model:show={this.modelShow}
        placement={this.placement}
        width={this.width}
      >
        <NDrawerContent title={t('headerSettingOptions.Title')}>
          <NSpace class="setting-drawer__space" vertical>
            <NDivider titlePlacement="center">
              {t('headerSettingOptions.ThemeOptions.Title')}
            </NDivider>
            <ThemeSwitch />
            <NDivider titlePlacement="center">
              {t('headerSettingOptions.ThemeOptions.PrimaryColorConfig')}
            </NDivider>
            <NColorPicker
              swatches={useSwatchesColorOptions()}
              v-model:value={this.primaryColorOverride.common!.primaryColor}
              onUpdateValue={this.changePrimaryColor.bind(this)}
            />
            <NDivider titlePlacement="center">
              {t('headerSettingOptions.InterfaceDisplay')}
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
              <NDescriptionsItem label="反转色">
                <NSwitch
                  v-model:value={this.invertSwitch}
                  onUpdateValue={(bool: boolean) =>
                    this.changeSwitcher(bool, 'invertSwitch')
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
