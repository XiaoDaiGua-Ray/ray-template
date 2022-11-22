import RayGlobalProvider from '@/components/RayGlobalProvider/index'
import { RouterView } from 'vue-router'

const App = defineComponent({
  name: 'App',
  setup() {
    const { height: windowHeight } = useWindowSize()

    return {
      windowHeight,
    }
  },
  render() {
    return (
      <RayGlobalProvider>
        <RouterView />
      </RayGlobalProvider>
    )
  },
})

export default App
