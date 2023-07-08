/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { getStorage } from '@/utils/cache'
import { get } from 'lodash-es'
import { useSetting } from '@/store'
import { addClass, removeClass, addStyle, colorToRgba } from '@/utils/element'

import type { SettingState } from '@/store/modules/setting/type'

const AppStyleProvider = defineComponent({
  name: 'AppStyleProvider',
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
      )

      if (primaryColorOverride) {
        const _p = get(
          primaryColorOverride,
          'primaryColorOverride.common.primaryColor',
          primaryColor,
        )
        const _fp = colorToRgba(_p, 0.38)

        /** 设置全局主题色 css 变量 */
        body.style.setProperty('--ray-theme-primary-color', _p)
        body.style.setProperty(
          '--ray-theme-primary-fade-color',
          _fp || primaryFadeColor,
        )
      }
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

    /** 切换主题时, 同步更新 body class 以便于进行自定义 css 配置 */
    const updateGlobalThemeClass = (bool: boolean) => {
      /**
       *
       * 初始化时根据当前主题色进行初始化 body 的 class 属性
       *
       * 根据 themeValue 进行初始化
       */
      const body = document.body
      const darkClassName = 'ray-template--dark'
      const lightClassName = 'ray-template--light'

      bool
        ? removeClass(body, lightClassName)
        : removeClass(body, darkClassName)

      addClass(body, bool ? darkClassName : lightClassName)
    }

    syncPrimaryColorToBody()
    hiddenLoadingAnimation()

    watch(
      () => themeValue.value,
      (ndata) => {
        updateGlobalThemeClass(ndata)
      },
      {
        immediate: true,
      },
    )
  },
  render() {
    return <div class="app-style-provider"></div>
  },
})

export default AppStyleProvider
