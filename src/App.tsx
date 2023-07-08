import { RouterView } from 'vue-router'
import AppNaiveGlobalProvider from '@/components/AppComponents/AppNaiveGlobalProvider/index'
import AppStyleProvider from '@/components/AppComponents/AppStyleProvider/index'
import GlobalSpin from '@/spin/index'
import LockScreen from '@/components/AppComponents/AppLockScreen/index'

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
