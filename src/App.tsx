import RayGlobalProvider from '@/components/RayGlobalProvider/index'
import { RouterView } from 'vue-router'
import GlobalSpin from '@/spin/index'
import LockScreen from '@/components/AppComponents/AppLockScreen/index'

import { getStorage } from '@/utils/cache'
import { get } from 'lodash-es'
import { useSetting } from '@/store'
import { addClass, removeClass, addStyle, colorToRgba } from '@/utils/element'

import type { SettingState } from '@/store/modules/setting/type'

const App = defineComponent({
  name: 'App',
  setup() {
    const settingStore = useSetting()

    const { themeValue } = storeToRefs(settingStore)

    /** 同步主题色变量至 body, 如果未获取到缓存值则已默认值填充 */
    const syncPrimaryColorToBody = () => {
      const {
        appPrimaryColor: { primaryColor, primaryFadeColor },
      } = __APP_CFG__ // 默认主题色
      const body = document.body

      const primaryColorOverride = getStorage<SettingState>(
        'piniaSettingStore',
        'localStorage',
        primaryColor,
      )
      const _p = get(
        primaryColorOverride as SettingState,
        'primaryColorOverride.common.primaryColor',
        primaryColor,
      )
      const _fp = colorToRgba(_p, 0.3)

      /** 设置全局主题色 css 变量 */
      body.style.setProperty('--ray-theme-primary-color', _p)
      body.style.setProperty(
        '--ray-theme-primary-fade-color',
        _fp || primaryFadeColor,
      )
    }

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

    syncPrimaryColorToBody()
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
        <LockScreen />

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
