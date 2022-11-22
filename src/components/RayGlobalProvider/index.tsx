import {
  NDialogProvider,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  NConfigProvider,
  NGlobalStyle,
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
