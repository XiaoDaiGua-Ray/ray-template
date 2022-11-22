import RayGlobalProvider from '@/components/RayGlobalProvider/index'
import { useSetting } from '@/store'
import { RouterView } from 'vue-router'

const App = defineComponent({
  name: 'App',
  setup() {
    const settingStore = useSetting()
    const { height: windowHeight } = useWindowSize()
    const { settingState } = $(storeToRefs(settingStore))

    // const naiveTheme = computed(() =>
    //   settingState.themeValue ? darkTheme : undefined,
    // )

    return {
      windowHeight,
      // naiveTheme,
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
