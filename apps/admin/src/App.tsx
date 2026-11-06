import { apiMockEnabled } from '@/api/admin/client'
import AppGlobalSpin from '@/app-components/app/AppGlobalSpin'
import AppLockScreen from '@/app-components/app/AppLockScreen'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider'
import AppVersionProvider from '@/app-components/provider/AppVersionProvider'
import AppWatermarkProvider from '@/app-components/provider/AppWatermarkProvider'
import {
  APP_CATCH_KEY_PREFIX,
  APP_GLOBAL_LOADING,
  APP_THEME,
} from '@/app-config'
import { useI18n } from '@/hooks/template/useI18n'
import { useSettingGetters } from '@/store'
import type { IconPackage } from '@ray-template/icons'
import { iconSprites } from '@ray-template/icons/manifest'
import { provideUiServices } from '@ray-template/ui/services'
import { createStorage } from '@ray-template/utils/storage'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    const { getAppTheme, getThemeStyle } = useSettingGetters()
    const { t } = useI18n()

    provideUiServices({
      dark: () => getAppTheme.value,
      chartTheme: () => APP_THEME.echartTheme ?? `ray-${getThemeStyle.value}`,
      translate: t,
      columnStorage: createStorage(window.localStorage, APP_CATCH_KEY_PREFIX),
      reportError: (message) => window.$message?.error(message),
      reportSuccess: (message) => window.$message?.success(message),
      iconUrl: (name, prefix) =>
        `${iconSprites[name.split('/')[0] as IconPackage]}#${prefix}-${name}`,
    })
  },
  render() {
    return (
      <AppNaiveGlobalProvider>
        <AppVersionProvider />
        {apiMockEnabled && <AppLockScreen />}
        <AppStyleProvider />
        <AppWatermarkProvider />
        <AppGlobalSpin>
          {{
            default: () => <RouterView />,
            description: () => APP_GLOBAL_LOADING,
          }}
        </AppGlobalSpin>
      </AppNaiveGlobalProvider>
    )
  },
})
