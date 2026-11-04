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

    const localePackage = computed(() => {
      const key = getLocaleLanguage.value

      return getNaiveLocales(key)
    })

    // 离散 API 自行挂载 Vue 应用；配置响应式更新，切换主题时无需在 render 中重新挂载。
    const { message, notification, dialog, loadingBar, unmount } =
      createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
        configProviderProps: computed(() => ({
          theme: getAppTheme.value ? darkTheme : null,
          themeOverrides: getPrimaryColorOverride.value,
          locale: localePackage.value.locale,
          dateLocale: localePackage.value.dateLocal,
        })),
      })

    window.$dialog = dialog
    window.$message = message
    window.$loadingBar = loadingBar
    window.$notification = notification
    onScopeDispose(unmount)

    expose()

    return {
      getPrimaryColorOverride,
      localePackage,
      getAppTheme,
    }
  },
  render() {
    const {
      $slots: { default: slotDefault },
    } = this
    const { getPrimaryColorOverride, getAppTheme, localePackage } = this

    return (
      <NConfigProvider
        themeOverrides={getPrimaryColorOverride}
        theme={getAppTheme ? darkTheme : null}
        locale={localePackage.locale}
        dateLocale={localePackage.dateLocal}
      >
        <NLoadingBarProvider>
          <NMessageProvider {...MESSAGE_PROVIDER}>
            <NDialogProvider>
              <NModalProvider>
                <NNotificationProvider>
                  <NGlobalStyle />
                  {slotDefault?.()}
                </NNotificationProvider>
              </NModalProvider>
            </NDialogProvider>
          </NMessageProvider>
        </NLoadingBarProvider>
      </NConfigProvider>
    )
  },
})
