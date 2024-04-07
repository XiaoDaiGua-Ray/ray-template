import { RouterView } from 'vue-router'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider'
import AppLockScreen from '@/app-components/app/AppLockScreen'
import AppWatermarkProvider from '@/app-components/provider/AppWatermarkProvider'
import AppGlobalSpin from '@/app-components/app/AppGlobalSpin'
import AppVersionProvider from '@/app-components/provider/AppVersionProvider'

import { APP_GLOBAL_LOADING } from '@/app-config'

export default defineComponent({
  name: 'App',
  render() {
    return (
      <AppNaiveGlobalProvider>
        <AppVersionProvider />
        <AppLockScreen />
        <AppStyleProvider />
        <AppWatermarkProvider />
        <AppGlobalSpin>
          {{
            default: () => <RouterView />,
            description: () => APP_GLOBAL_LOADING,
          }}
        </AppGlobalSpin>
      </AppNaiveGlobalProvider>
    )
  },
})
