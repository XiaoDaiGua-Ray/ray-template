import { APP_CATCH_KEY, APP_THEME } from '@/app-config'
import { useDayjs, useI18n } from '@/hooks'
import type { LocalKey } from '@/hooks'
import { resolveIconName } from '@/icons'
import { getAppDefaultLanguage } from '@/locales/utils'
import type { SettingState } from '@/store/modules/setting/types'
import type { AnyFn } from '@/types'
import { setStorage } from '@/utils/cache'
import { colorToRgba, setStyle } from '@/utils/element'
import { updateObjectValue } from '@/utils/update-object-value'
import {
  normalizeThemeStyle,
  themeStyleOverrides,
} from '@ray-template/ui/theme-presets'
import { usePreferredDark } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { getDefaultSettingConfig, normalizeLayoutConfig } from './constant'
import { createPreferenceFile, parsePreferenceFile } from './preference-file'

export const piniaSettingStore = defineStore(
  'setting',
  () => {
    const { locale } = useI18n()
    const { locale: dayjsLocal } = useDayjs()
    const preferredDark = usePreferredDark()

    const settingState = reactive<SettingState>({
      primaryColorOverride: {},
      // 内部使用，用于判断是否为黑夜主题（为了兼容历史遗留版本）；true 为黑夜主题，false 为明亮主题
      _appTheme: false,
      // 当前主题样式
      appTheme: 'light',
      // 默认国际化语言
      localeLanguage: getAppDefaultLanguage(),
      // 锁屏开关
      lockScreenSwitch: false,
      // 根路由信息
      appRootRoute: {
        name: 'Dashboard',
        path: '/dashboard',
      },
      // 侧边栏设置
      sideBarLogo: {
        icon: 'logo/ray',
        title: 'Ray Admin',
        url: '/dashboard',
        jumpType: 'station',
      },
      ...cloneDeep(getDefaultSettingConfig()),
    })

    // 修改当前语言
    const updateLocale = (key: string) => {
      locale(key)
      dayjsLocal(key as LocalKey)
      setStorage(APP_CATCH_KEY.localeLanguage, key, 'localStorage')

      settingState.localeLanguage = key
    }

    /**
     *
     * @description
     * 切换主题色，传递对应颜色即可更新 naive-ui 的主题色。
     */
    const changePrimaryColor = (value?: string, alpha = 0.85) => {
      if (!value) {
        settingState.primaryColorOverride = {}

        return
      }

      const hover = colorToRgba(value, alpha) || value

      settingState.primaryColorOverride = {
        common: {
          primaryColor: value,
          primaryColorHover: hover,
          primaryColorPressed: value,
          primaryColorSuppl: hover,
        },
      }
    }

    const themeOverrides = computed(() => {
      const mode = settingState._appTheme ? 'dark' : 'light'
      const style = normalizeThemeStyle(settingState.themeStyle)
      const preset =
        style === 'modern'
          ? APP_THEME.appNaiveUIThemeOverrides[mode]
          : themeStyleOverrides[style][mode]

      return {
        ...preset,
        common: {
          ...preset.common,
          ...settingState.primaryColorOverride.common,
        },
      }
    })

    const syncAppTheme = () => {
      settingState._appTheme =
        settingState.appTheme === 'auto'
          ? preferredDark.value
          : settingState.appTheme === 'dark'
    }

    /**
     *
     * @param key settingState 的 key
     * @param value settingState 的 value
     * @param cb 回调函数
     *
     * @description
     * 更新 settingState 的值，如果 key 不存在与 settingState 中，则不会更新。
     *
     * @example
     * updateSettingState('drawerPlacement', 'left')
     * updateSettingState('appTheme', 'dark')
     */
    const updateSettingState = <
      T extends keyof SettingState,
      V extends typeof settingState,
      C extends AnyFn,
    >(
      key: T,
      value: Partial<V[T]>,
      cb?: C,
    ) => {
      if (key === 'layoutConfig') {
        settingState.layoutConfig = normalizeLayoutConfig({
          ...settingState.layoutConfig,
          ...(value as object),
        })
        cb?.()

        return
      }

      if (key === 'themeStyle') {
        settingState.themeStyle = normalizeThemeStyle(value)
        cb?.()

        return
      }

      updateObjectValue(settingState, key, value as V[T], cb)
    }

    const toggleColorWeakness = (bool: boolean) => {
      updateSettingState('colorWeakness', bool)
    }

    const exportPreferences = () => createPreferenceFile(settingState)

    const importPreferences = (text: string) => {
      const { primaryColor, ...preferences } = parsePreferenceFile(text)

      Object.assign(settingState, preferences)
      changePrimaryColor(primaryColor)
    }

    watch(
      () =>
        settingState.appTheme === 'auto'
          ? preferredDark.value
          : settingState.appTheme,
      syncAppTheme,
      { flush: 'sync' },
    )

    watch(
      () => settingState.colorWeakness,
      (enabled) =>
        setStyle(document.documentElement, {
          filter: enabled ? 'invert(100%)' : '',
        }),
      { immediate: true },
    )

    watch(
      () =>
        settingState.dynamicDocumentTitle
          ? void 0
          : settingState.sideBarLogo?.title || 'Ray Template',
      (title) => {
        if (title) document.title = title
      },
      { immediate: true },
    )

    return {
      ...toRefs(settingState),
      themeOverrides,
      syncAppTheme,
      updateLocale,
      changePrimaryColor,
      updateSettingState,
      toggleColorWeakness,
      exportPreferences,
      importPreferences,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaSettingStore,
      omit: ['lockScreenSwitch'],
      storage: window.localStorage,
      afterHydrate: ({ store }) => {
        store.layoutConfig = normalizeLayoutConfig(store.layoutConfig)
        store.themeStyle = normalizeThemeStyle(store.themeStyle)
        store.syncAppTheme()

        // 旧缓存混有整套主题 token；只保留用户设置的主色，避免污染其它风格。
        const common = store.primaryColorOverride?.common
        const { primaryColor, primaryFadeColor } = APP_THEME.appPrimaryColor
        const wasDefault =
          common?.bodyColor &&
          common.primaryColor === primaryColor &&
          common.primaryColorHover === primaryFadeColor
        const accent = common?.primaryColor

        store.changePrimaryColor(
          !wasDefault && typeof accent === 'string' ? accent : void 0,
        )

        if (typeof store.sideBarLogo?.icon === 'string') {
          store.sideBarLogo.icon = resolveIconName(store.sideBarLogo.icon)
        }
      },
    },
  },
)
