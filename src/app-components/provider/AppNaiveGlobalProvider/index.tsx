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

    /**
     *
     * @description
     * 在渲染作用域内创建全局提示实例，使离散提示与当前主题和语言保持一致。
     */
    const discreteApi = () => {
      const { message, notification, dialog, loadingBar } = createDiscreteApi(
        ['message', 'dialog', 'notification', 'loadingBar'],
        {
          configProviderProps: computed(() => ({
            theme: getAppTheme.value ? darkTheme : null,
            themeOverrides: getPrimaryColorOverride.value,
            locale: localePackage.value.locale,
            dateLocale: localePackage.value.dateLocal,
          })),
        },
      )

      window.$dialog = dialog // 注入 `dialog`
      window.$message = message // 注入 `message`
      window.$loadingBar = loadingBar // 注入 `loadingBar`
      window.$notification = notification // 注入 `notification`
    }

    expose()

    return {
      getPrimaryColorOverride,
      localePackage,
      getAppTheme,
      discreteApi,
    }
  },
  render() {
    const {
      $slots: { default: slotDefault },
      discreteApi,
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
                  {discreteApi()}
                </NNotificationProvider>
              </NModalProvider>
            </NDialogProvider>
          </NMessageProvider>
        </NLoadingBarProvider>
      </NConfigProvider>
    )
  },
})
