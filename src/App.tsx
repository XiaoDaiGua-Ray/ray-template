import { RouterView } from 'vue-router'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider'
import AppLockScreen from '@/app-components/app/AppLockScreen'
import AppWatermarkProvider from '@/app-components/provider/AppWatermarkProvider'
import AppGlobalSpin from '@/spin'

export default defineComponent({
  name: 'App',
  render() {
    return (
      <AppNaiveGlobalProvider>
        <AppLockScreen />
        <AppStyleProvider />
        <AppWatermarkProvider />
        <AppGlobalSpin>
          {{
            default: () => <RouterView />,
            description: () => 'loading...',
          }}
        </AppGlobalSpin>
      </AppNaiveGlobalProvider>
    )
  },
})
