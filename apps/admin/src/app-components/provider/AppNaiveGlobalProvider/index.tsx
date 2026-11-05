import { MESSAGE_PROVIDER } from '@/app-config'
import { getNaiveLocales } from '@/locales/utils'
import { useSettingGetters } from '@/store'
import {
  createDiscreteApi,
  darkTheme,
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  NModalProvider,
  NNotificationProvider,
} from 'naive-ui'

export default defineComponent({
  name: 'GlobalProvider',
  setup(_, { expose }) {
    const { getPrimaryColorOverride, getAppTheme, getLocaleLanguage } =
      useSettingGetters()

    const configProviderProps = computed(() => {
      const { locale, dateLocal } = getNaiveLocales(getLocaleLanguage.value)

      return {
        theme: getAppTheme.value ? darkTheme : null,
        themeOverrides: getPrimaryColorOverride.value,
        locale,
        dateLocale: dateLocal,
      }
    })

    // 离散 API 有独立的 Vue 应用，复用同一份响应式配置。
    const { message, notification, dialog, loadingBar, unmount } =
      createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
        configProviderProps,
      })

    window.$dialog = dialog
    window.$message = message
    window.$loadingBar = loadingBar
    window.$notification = notification
    onScopeDispose(unmount)

    expose()

    return { configProviderProps }
  },
  render() {
    return (
      <NConfigProvider {...this.configProviderProps}>
        <NLoadingBarProvider>
          <NMessageProvider {...MESSAGE_PROVIDER}>
            <NDialogProvider>
              <NModalProvider>
                <NNotificationProvider>
                  <NGlobalStyle />
                  {this.$slots.default?.()}
                </NNotificationProvider>
              </NModalProvider>
            </NDialogProvider>
          </NMessageProvider>
        </NLoadingBarProvider>
      </NConfigProvider>
    )
  },
})
