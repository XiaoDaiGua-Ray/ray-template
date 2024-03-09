/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-14
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 全局注入 naive ui 提示性组件
 * 使用该组件注册后, 可以直接通过 window.$message、window.$notification、window.$dialog、window.$loadingBar 访问
 * 但是, 使用该组件注册后, 使用 window.$notification 组件时不能更改 placement 位置(只能默认右上角弹出)
 * 如果需要更改弹出位置, 需要在需要地方重新定义组件注册
 */

import {
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  NConfigProvider,
  createDiscreteApi,
  darkTheme,
  NGlobalStyle,
  NModalProvider,
} from 'naive-ui'

import { getNaiveLocales } from '@/locales/utils'
import { useSettingGetters } from '@/store'

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
     * 使用 createDiscreteApi 脱离上下文 api 注入一些常用的组件
     * 通过 window.$message、window.$notification、window.$dialog、window.$loadingBar 访问
     * 但是，使用该组件注册后，使用 window.$notification 组件时不能更改 placement 位置（只能默认右上角弹出）
     *
     * 改为函数包裹，避免 `slot default invoked outside of render` 警告
     */
    const discreteApi = () => {
      const { message, notification, dialog, loadingBar } = createDiscreteApi(
        ['message', 'dialog', 'notification', 'loadingBar'],
        {
          configProviderProps: computed(() => ({
            theme: getAppTheme.value ? darkTheme : null,
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
          <NMessageProvider>
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
