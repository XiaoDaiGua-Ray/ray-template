import './index.scss'

import {
  NDrawer,
  NDrawerContent,
  NFlex,
  NButton,
  NTabs,
  NTabPane,
} from 'naive-ui'
import { RIcon } from '@/components'
import SegmentViewsAppearance from './segment-views/Appearance'
import SegmentViewsCommon from './segment-views/Common'
import SegmentViewsWatermark from './segment-views/Watermark'
import SegmentViewsCustomMenu from './segment-views/CustomMenu'

import { useSettingGetters, useSettingActions, useMenuActions } from '@/store'
import { getDefaultSettingConfig, SETTING_DRAWER_INJECT_KEY } from './constant'
import { forIn, throttle } from 'lodash-es'
import { drawerProps } from 'naive-ui'
import { useModal } from '@/components'

import type { SettingState } from '@/store/modules/setting/types'

export default defineComponent({
  name: 'SettingDrawer',
  props: drawerProps,
  setup() {
    const { create: createModal } = useModal()
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
      getColorWeakness,
      getWatermarkConfig,
      getDynamicDocumentTitle,
    } = useSettingGetters()
    const { setupAppMenu } = useMenuActions()
    const throttleSetupAppMenu = throttle(setupAppMenu, 300)
    const modelReactive = reactive({
      menuTagSwitch: getMenuTagSwitch.value,
      breadcrumbSwitch: getBreadcrumbSwitch.value,
      copyrightSwitch: getCopyrightSwitch.value,
      contentTransition: getContentTransition.value,
      watermarkSwitch: getWatermarkSwitch.value,
      keepAliveConfig: getKeepAliveConfig.value,
      menuConfig: getMenuConfig.value,
      drawerPlacement: getDrawerPlacement.value,
      colorWeakness: getColorWeakness.value,
      primaryColorOverride: getPrimaryColorOverride.value,
      watermarkConfig: getWatermarkConfig.value,
      dynamicDocumentTitle: getDynamicDocumentTitle.value,
      throttleSetupAppMenu,
    })

    const defaultSettingBtnClick = () => {
      createModal({
        preset: 'dialog',
        title: '恢复默认配置',
        type: 'warning',
        content: '点击【确认初始化】按钮会恢复默认系统配置，是否继续?',
        positiveText: '确认初始化',
        negativeText: '取消',
        onPositiveClick: () => {
          forIn(getDefaultSettingConfig(), (value, key) => {
            modelReactive[key] = value

            updateSettingState(key as keyof SettingState, value)
          })

          throttleSetupAppMenu()
        },
      })
    }

    provide(SETTING_DRAWER_INJECT_KEY, modelReactive)

    return {
      changePrimaryColor,
      getAppTheme,
      getPrimaryColorOverride,
      updateSettingState,
      modelReactive,
      defaultSettingBtnClick,
    }
  },
  render() {
    const { defaultSettingBtnClick, $props } = this
    const { trapFocus, autoFocus, nativeScrollbar, ...restProps } = $props

    return (
      <NDrawer {...restProps} trapFocus={false} autoFocus={false} width={320}>
        <NDrawerContent title="个性化配置" closable>
          {{
            default: () => (
              <NTabs type="bar" animated defaultValue="appearance">
                <NTabPane name="appearance" tab="外观">
                  <SegmentViewsAppearance />
                </NTabPane>
                <NTabPane name="menu" tab="菜单">
                  <SegmentViewsCustomMenu />
                </NTabPane>
                <NTabPane name="watermark" tab="水印">
                  <SegmentViewsWatermark />
                </NTabPane>
                <NTabPane name="common" tab="通用">
                  <SegmentViewsCommon />
                </NTabPane>
              </NTabs>
            ),
            footer: () => (
              <NFlex justify="flex-start">
                <NButton type="warning" onClick={defaultSettingBtnClick}>
                  {{
                    icon: () => <RIcon name="reload" />,
                    default: () => '初始化配置',
                  }}
                </NButton>
              </NFlex>
            ),
          }}
        </NDrawerContent>
      </NDrawer>
    )
  },
})
