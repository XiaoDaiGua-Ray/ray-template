import RayGlobalProvider from '@/components/RayGlobalProvider/index'
import { RouterView } from 'vue-router'
import GlobalSpin from '@/spin/index'

const App = defineComponent({
  name: 'App',
  render() {
    return (
      <RayGlobalProvider>
        <GlobalSpin>
          {{
            default: () => <RouterView />,
            description: () => 'lodaing...',
          }}
        </GlobalSpin>
      </RayGlobalProvider>
    )
  },
})

export default App
