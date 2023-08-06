import { RouterView } from 'vue-router'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider/index'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider/index'
import AppLockScreen from '@/app-components/app/AppLockScreen/index'
import AppGlobalSpin from '@/spin/index'

const App = defineComponent({
  name: 'App',
  render() {
    return (
      <AppNaiveGlobalProvider>
        <AppLockScreen />
        <AppStyleProvider />

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

export default App
