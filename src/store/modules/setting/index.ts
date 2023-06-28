import { getDefaultLocal } from '@/locales/helper'
import { setCache } from '@use-utils/cache'
import { set } from 'lodash-es'
import { addClass, removeClass, colorToRgba } from '@/utils/element'
import { useI18n } from '@/locales/useI18n'
import { APP_NAIVE_UI_THEME_OVERRIDES } from '@/appConfig/designConfig'
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
        ...APP_NAIVE_UI_THEME_OVERRIDES,
        common: {
          primaryColor: primaryColor, // 主题色
          primaryColorHover: primaryColor,
        },
      },
      themeValue: false, // `true` 为黑夜主题, `false` 为白色主题
      reloadRouteSwitch: true, // 刷新路由开关
      menuTagSwitch: true, // 多标签页开关
      spinSwitch: false, // 全屏加载
      invertSwitch: false, // 反转色模式
      breadcrumbSwitch: true, // 面包屑开关
      localeLanguage: getDefaultLocal(),
      lockScreenSwitch: false, // 锁屏开关
      lockScreenInputSwitch: false, // 锁屏输入状态开关(预留该字段是为了方便拓展用, 但是舍弃了该字段, 改为使用 useAppLockScreen 方法)
    })

    /** 修改当前语言 */
    const updateLocale = (key: string) => {
      locale(key)
      dayjsLocal(key as DayjsLocal)

      settingState.localeLanguage = key

      setCache('localeLanguage', key, 'localStorage')
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

    /** 动态添加反转色 class name */
    watch(
      () => settingState.invertSwitch,
      (newData) => {
        const body = document.body
        const className = 'ray-template--invert'

        newData ? addClass(body, className) : removeClass(body, className)
      },
    )

    return {
      ...toRefs(settingState),
      updateLocale,
      changePrimaryColor,
      changeSwitcher,
    }
  },
  {
    persist: {
      key: 'piniaSettingStore',
    },
  },
)
