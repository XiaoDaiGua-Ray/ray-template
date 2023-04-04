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

    /** 同步主题色变量至 body, 如果未获取到缓存值则已默认值填充 */
    const syncPrimaryColorToBody = () => {
      /** 默认值 */
      const { primaryColor } = __APP_CFG__
      const body = document.body

      const primaryColorOverride = getCache('piniaSettingStore', 'localStorage')
      const _p = get(
        primaryColorOverride,
        'primaryColorOverride.common.primaryColor',
      )

      body.style.setProperty('--ray-theme-primary-color', _p || primaryColor)
    }

    /** 隐藏加载动画 */
    const hiddenLoadingAnimation = () => {
      const el = document.getElementById('pre-loading-animation')

      if (el) {
        addStyle(el, {
          display: 'none',
        })
      }
    }

    syncPrimaryColorToBody()
    hiddenLoadingAnimation()

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
