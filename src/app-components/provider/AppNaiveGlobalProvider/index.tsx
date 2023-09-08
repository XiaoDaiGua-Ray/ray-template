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
} from 'naive-ui'

import { useSetting } from '@/store'
import { naiveLocales } from '@/locales/helper'

export default defineComponent({
  name: 'GlobalProvider',
  setup(_, { expose }) {
    const settingStore = useSetting()

    const modelPrimaryColorOverride = computed(
      () => settingStore.primaryColorOverride,
    )
    const modelThemeValue = computed(() =>
      settingStore.themeValue ? darkTheme : null,
    )
    const localePackage = computed(() => {
      const key = settingStore.localeLanguage

      return naiveLocales(key)
    })

    const { message, notification, dialog, loadingBar } = createDiscreteApi(
      ['message', 'dialog', 'notification', 'loadingBar'],
      {
        configProviderProps: computed(() => ({
          theme: modelThemeValue.value,
        })),
        notificationProviderProps: {},
      },
    )

    window.$dialog = dialog // 注入 `dialog`
    window.$message = message // 注入 `message`
    window.$loadingBar = loadingBar // 注入 `loadingBar`
    window.$notification = notification // 注入 `notification`

    expose()

    return {
      modelPrimaryColorOverride,
      modelThemeValue,
      localePackage,
    }
  },
  render() {
    return (
      <NConfigProvider
        themeOverrides={this.modelPrimaryColorOverride}
        theme={this.modelThemeValue}
        locale={this.localePackage.locale}
        dateLocale={this.localePackage.dateLocal}
      >
        <NLoadingBarProvider>
          <NMessageProvider>
            <NDialogProvider>
              <NNotificationProvider>
                <NGlobalStyle />
                {this.$slots.default?.()}
              </NNotificationProvider>
            </NDialogProvider>
          </NMessageProvider>
        </NLoadingBarProvider>
      </NConfigProvider>
    )
  },
})
