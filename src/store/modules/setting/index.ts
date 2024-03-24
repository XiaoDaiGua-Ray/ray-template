import { getAppDefaultLanguage } from '@/locales/utils'
import { colorToRgba, setStorage } from '@/utils'
import { useI18n, useDayjs } from '@/hooks'
import { watchOnce } from '@vueuse/core'
import { APP_CATCH_KEY, APP_THEME } from '@/app-config'

import type { SettingState } from '@/store/modules/setting/types'
import type { LocalKey } from '@/hooks'
import type { AnyFC } from '@/types'

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
        common: {
          primaryColor: primaryColor,
          primaryColorHover: primaryColor,
          primaryColorPressed: primaryColor,
        },
      },
      appTheme: false, // true 为黑夜主题, false 为明亮主题
      menuTagSwitch: true, // 多标签页开关
      breadcrumbSwitch: true, // 面包屑开关
      localeLanguage: getAppDefaultLanguage(),
      lockScreenSwitch: false, // 锁屏开关
      copyrightSwitch: true, // 底部区域开关
      contentTransition: 'scale', // 切换过渡效果
      watermarkSwitch: false, // 水印开关,
      watermarkConfig: {
        content: 'Trying be better~',
        fontSize: 16,
        lineHeight: 16,
        width: 384,
        height: 384,
        xOffset: 12,
        yOffset: 60,
        rotate: -15,
      },
      appRootRoute: {
        name: 'Dashboard',
        path: '/dashboard',
      },
    })

    /** 修改当前语言 */
    const updateLocale = (key: string) => {
      locale(key)
      dayjsLocal(key as LocalKey)

      settingState.localeLanguage = key

      setStorage(APP_CATCH_KEY.localeLanguage, key, 'localStorage')
    }

    /**
     *
     * 切换主题色，传递对应颜色即可更新 naive-ui 的主题色
     */
    const changePrimaryColor = (value: string, alpha = 0.3) => {
      const alphaColor = colorToRgba(value, alpha)
      const themeOverrides = {
        primaryColor: value,
        primaryColorHover: value,
        primaryColorPressed: value,
      }

      settingState.primaryColorOverride.common = themeOverrides

      const body = document.body

      /** 设置主题色变量 */
      body.style.setProperty('--ray-theme-primary-color', value)
      body.style.setProperty('--ray-theme-primary-fade-color', alphaColor)
    }

    /**
     *
     * @param key settingState 的 key
     * @param value settingState 的 value
     * @param cb 回调函数
     *
     * 更新 settingState 的值，如果 key 不存在与 settingState 中，则不会更新
     * 但是不论是否更新成功，都会执行回调函数
     *
     * @example
     * updateSettingState('drawerPlacement', 'left')
     * updateSettingState('appTheme', true)
     */
    const updateSettingState = <
      T extends keyof SettingState,
      V extends typeof settingState,
      C extends AnyFC,
    >(
      key: T,
      value: V[T],
      cb?: C,
    ) => {
      if (Reflect.has(settingState, key)) {
        settingState[key] = value
      }

      cb?.()
    }

    /**
     *
     * 初始化合并自定义主题色
     * 该方法会在初始化时执行一次，之后会在切换主题色时执行
     */
    watchOnce(
      () => settingState.appTheme,
      (ndata) => {
        ndata
          ? Object.assign(
              {},
              settingState.primaryColorOverride,
              APP_THEME.appNaiveUIThemeOverrides.dark,
              APP_THEME.appNaiveUIThemeOverridesCommon.dark,
            )
          : Object.assign(
              {},
              settingState.primaryColorOverride,
              APP_THEME.appNaiveUIThemeOverrides.light,
              APP_THEME.appNaiveUIThemeOverridesCommon.light,
            )
      },
      {
        immediate: true,
      },
    )

    return {
      ...toRefs(settingState),
      updateLocale,
      changePrimaryColor,
      updateSettingState,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaSettingStore,
    },
  },
)
