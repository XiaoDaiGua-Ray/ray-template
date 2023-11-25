import { getAppDefaultLanguage } from '@/locales/helper'
import { setStorage } from '@use-utils/cache'
import { set } from 'lodash-es'
import { colorToRgba } from '@/utils/element'
import { useI18n } from '@/hooks/web'
import { APP_THEME } from '@/app-config/designConfig'
import { useDayjs } from '@/hooks/web'

import type { ConditionalPick } from '@/types/modules/helper'
import type { SettingState } from '@/store/modules/setting/type'
import type { LocalKey } from '@/hooks/web'

export const piniaSettingStore = defineStore(
  'setting',
  () => {
    const {
      appPrimaryColor: { primaryColor },
    } = __APP_CFG__ // 默认主题色
    const { locale } = useI18n()
    const { locale: dayjsLocal } = useDayjs()

    const settingState = reactive<SettingState>({
      drawerPlacement: 'right',
      primaryColorOverride: {
        ...APP_THEME.appNaiveUIThemeOverrides,
        common: {
          primaryColor: primaryColor, // 主题色
          primaryColorHover: primaryColor,
        },
      },
      appTheme: false, // `true` 为黑夜主题, `false` 为白色主题
      menuTagSwitch: true, // 多标签页开关
      breadcrumbSwitch: true, // 面包屑开关
      localeLanguage: getAppDefaultLanguage(),
      lockScreenSwitch: false, // 锁屏开关
      copyrightSwitch: true, // 底部区域开关
      contentTransition: 'scale', // 切换过渡效果
      watermarkSwitch: false, // 水印开关,
    })

    /** 更新过渡效果 */
    const updateContentTransition = (value: string) => {
      settingState.contentTransition = value
    }

    /** 修改当前语言 */
    const updateLocale = (key: string) => {
      locale(key)
      dayjsLocal(key as LocalKey)

      settingState.localeLanguage = key

      setStorage('localeLanguage', key, 'localStorage')
    }

    /** 切换主题色 */
    const changePrimaryColor = (value: string, alpha = 0.3) => {
      set(
        settingState,
        'settingState.primaryColorOverride.common.primaryColorHover',
        value,
      )

      const body = document.body

      /** 设置主题色变量 */
      body.style.setProperty('--ray-theme-primary-color', value)
      body.style.setProperty(
        '--ray-theme-primary-fade-color',
        colorToRgba(value, alpha),
      )
    }

    /**
     *
     * @param bool 开关当前值
     * @param key `settingState` 对应开关属性值
     *
     * @remark 仅适用于值为 `boolean` 的切换
     */
    const changeSwitcher = (
      bool: boolean,
      key: keyof ConditionalPick<SettingState, boolean>,
    ) => {
      if (
        Object.hasOwn(settingState, key) &&
        typeof settingState[key] === 'boolean'
      ) {
        settingState[key] = bool
      }
    }

    return {
      ...toRefs(settingState),
      updateLocale,
      changePrimaryColor,
      changeSwitcher,
      updateContentTransition,
    }
  },
  {
    persist: {
      key: 'piniaSettingStore',
    },
  },
)
