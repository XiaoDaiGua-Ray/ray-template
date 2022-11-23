import {
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  NConfigProvider,
  createDiscreteApi,
  darkTheme,
} from 'naive-ui'
import { useSetting } from '@/store'

const GlobalProvider = defineComponent({
  name: 'GlobalProvider',
  setup() {
    const settingStore = useSetting()

    const modelPrimaryColorOverride = computed(
      () => settingStore.primaryColorOverride,
    )
    const modelThemeValue = computed(() =>
      settingStore.themeValue ? darkTheme : null,
    )

    const { message, notification, dialog, loadingBar } = createDiscreteApi(
      ['message', 'dialog', 'notification', 'loadingBar'],
      {
        configProviderProps: computed(() => ({
          theme: modelThemeValue.value,
        })),
      },
    )

    window.$dialog = dialog // 注入 `dialog`
    window.$message = message // 注入 `message`
    window.$loadingBar = loadingBar // 注入 `loadingBar`
    window.$notification = notification // 注入 `notification`

    return {
      modelPrimaryColorOverride,
      modelThemeValue,
    }
  },
  render() {
    return (
      <NConfigProvider
        themeOverrides={this.modelPrimaryColorOverride}
        theme={this.modelThemeValue}
      >
        <NLoadingBarProvider>
          <NMessageProvider>
            <NDialogProvider>
              <NNotificationProvider>
                {this.$slots.default?.()}
              </NNotificationProvider>
            </NDialogProvider>
          </NMessageProvider>
        </NLoadingBarProvider>
      </NConfigProvider>
    )
  },
})

export default GlobalProvider
