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
    const modelLocal = computed(() => settingStore.naiveLocal)

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
      modelLocal,
    }
  },
  render() {
    return (
      <NConfigProvider
        themeOverrides={this.modelPrimaryColorOverride}
        theme={this.modelThemeValue}
        locale={this.modelLocal.local}
        dateLocal={this.modelLocal.dateLocal}
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

export default GlobalProvider
