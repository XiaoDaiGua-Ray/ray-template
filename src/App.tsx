import RayGlobalProvider from '@/components/RayGlobalProvider/index'
import { RouterView } from 'vue-router'
import GlobalSpin from '@/spin/index'

import { getCache } from '@/utils/cache'
import { get } from 'lodash-es'
import { useSetting } from '@/store'
import { addClass, removeClass, addStyle } from '@/utils/element'

const App = defineComponent({
  name: 'App',
  setup() {
    const settingStore = useSetting()

    const { themeValue } = storeToRefs(settingStore)

    /** 隐藏加载动画 */
    const hiddenLoadingAnimation = () => {
      /** pre-loading-animation 是默认 id */
      const el = document.getElementById('pre-loading-animation')

      if (el) {
        addStyle(el, {
          display: 'none',
        })
      }
    }

    hiddenLoadingAnimation()

    /** 切换主题时, 同步更新 body class 以便于进行自定义 css 配置 */
    watch(
      () => themeValue.value,
      (newData) => {
        /**
         *
         * 初始化时根据当前主题色进行初始化 body 的 class 属性
         *
         * 根据 themeValue 进行初始化
         */
        const body = document.body
        const darkClassName = 'ray-template--dark'
        const lightClassName = 'ray-template--light'

        newData
          ? removeClass(body, lightClassName)
          : removeClass(body, darkClassName)

        addClass(body, newData ? darkClassName : lightClassName)
      },
      {
        immediate: true,
      },
    )
  },
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
