import { getAppDefaultLanguage } from '@/locales/helper'
import { setStorage } from '@use-utils/cache'
import { set } from 'lodash-es'
import { addClass, removeClass, colorToRgba } from '@/utils/element'
import { useI18n } from '@/locales/useI18n'
import { APP_THEME } from '@/app-config/designConfig'
import { useDayjs } from '@/dayjs/index'

import type { ConditionalPick } from '@/types/modules/helper'
import type { SettingState } from '@/store/modules/setting/type'
import type { DayjsLocal } from '@/dayjs/type'

export const useSetting = defineStore(
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
        ...APP_THEME.APP_NAIVE_UI_THEME_OVERRIDES,
        common: {
          primaryColor: primaryColor, // 主题色
          primaryColorHover: primaryColor,
        },
      },
      themeValue: false, // `true` 为黑夜主题, `false` 为白色主题
      reloadRouteSwitch: true, // 刷新路由开关
      menuTagSwitch: true, // 多标签页开关
      spinSwitch: false, // 全屏加载
      breadcrumbSwitch: true, // 面包屑开关
      localeLanguage: getAppDefaultLanguage(),
      lockScreenSwitch: false, // 锁屏开关
      lockScreenInputSwitch: false, // 锁屏输入状态开关(预留该字段是为了方便拓展用, 但是舍弃了该字段, 改为使用 useAppLockScreen 方法)
      footerSwitch: true, // 底部区域开关
      contentTransition: 'scale', // 切换过渡效果
    })

    /** 更新过渡效果 */
    const updateContentTransition = (value: string) => {
      settingState.contentTransition = value
    }

    /** 修改当前语言 */
    const updateLocale = (key: string) => {
      locale(key)
      dayjsLocal(key as DayjsLocal)

      settingState.localeLanguage = key

      setStorage('localeLanguage', key, 'localStorage')
    }

    /** 切换主题色 */
    const changePrimaryColor = (value: string) => {
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
        colorToRgba(value, 0.3),
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
