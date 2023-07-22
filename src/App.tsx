import { RouterView } from 'vue-router'
import AppNaiveGlobalProvider from '@/app-components/provider/AppNaiveGlobalProvider/index'
import AppStyleProvider from '@/app-components/provider/AppStyleProvider/index'
import GlobalSpin from '@/spin/index'
import LockScreen from '@/app-components/app/AppLockScreen/index'

const App = defineComponent({
  name: 'App',
  render() {
    return (
      <AppNaiveGlobalProvider>
        <LockScreen />
        <AppStyleProvider />

        <GlobalSpin>
          {{
            default: () => <RouterView />,
            description: () => 'lodaing...',
          }}
        </GlobalSpin>
      </AppNaiveGlobalProvider>
    )
  },
})

export default App
