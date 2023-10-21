import { RouterView } from 'vue-router'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider/index'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider/index'
import AppLockScreen from '@/app-components/app/AppLockScreen/index'
import AppWatermarkProvider from '@/app-components/provider/AppWatermarkProvider/index'
import AppGlobalSpin from '@/spin/index'

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
            description: () => 'lodaing...',
          }}
        </AppGlobalSpin>
      </AppNaiveGlobalProvider>
    )
  },
})
