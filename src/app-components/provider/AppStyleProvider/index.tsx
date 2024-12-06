import { get } from 'lodash-es'
import {
  setClass,
  removeClass,
  setStyle,
  colorToRgba,
  getStorage,
} from '@/utils'
import { useSettingGetters } from '@/store'
import { APP_CATCH_KEY, GLOBAL_CLASS_NAMES, APP_THEME } from '@/app-config'
import { useWindowSize } from '@vueuse/core'

import type { SettingState } from '@/store/modules/setting/types'

export default defineComponent({
  name: 'AppStyleProvider',
  setup(_, { expose }) {
    const { getAppTheme } = useSettingGetters()
    const { height, width } = useWindowSize()

    // 同步主题色变量至 html，如果未获取到缓存值则已默认值填充
    const syncPrimaryColorToBody = () => {
      // 默认主题色
      const {
        appPrimaryColor: { primaryColor, primaryFadeColor },
      } = APP_THEME
      // 主题色配置 class 名
      const { rayTemplateThemePrimaryColor, rayTemplateThemePrimaryFadeColor } =
        GLOBAL_CLASS_NAMES

      const html = document.documentElement

      // 获取缓存 naive ui 配置项
      const primaryColorOverride = getStorage<SettingState>(
        APP_CATCH_KEY.appPiniaSettingStore,
        'localStorage',
      )

      if (primaryColorOverride) {
        // 获取主色调
        const p = get(
          primaryColorOverride,
          'primaryColorOverride.common.primaryColor',
          primaryColor,
        )
        // 将主色调任意颜色转换为 rgba 格式
        const fp = colorToRgba(p, 0.8)

        // 设置全局主题色 css 变量
        html.style.setProperty(rayTemplateThemePrimaryColor, p) // 主色调
        // 降低透明度后的主色调
        html.style.setProperty(
          rayTemplateThemePrimaryFadeColor,
          fp || primaryFadeColor,
        )
      }
    }

    // 隐藏加载动画
    const hiddenLoadingAnimation = () => {
      // pre-loading-animation 是默认 id
      const el = document.getElementById(GLOBAL_CLASS_NAMES.preLoadingAnimation)

      if (el) {
        setStyle(el, {
          display: 'none',
        })
      }
    }

    // 切换主题时，同步更新 html class 以便于进行自定义 css 配置
    const updateGlobalThemeClass = (bool: boolean) => {
      const html = document.documentElement
      const { darkClassName, lightClassName } = GLOBAL_CLASS_NAMES

      bool
        ? removeClass(html, lightClassName)
        : removeClass(html, darkClassName)

      setClass(html, bool ? darkClassName : lightClassName)
    }

    syncPrimaryColorToBody()
    hiddenLoadingAnimation()

    watchEffect(() => {
      // 当切换主题时，更新 html 当前的注入 class
      updateGlobalThemeClass(getAppTheme.value)
      // 注入全局宽高尺寸
      setStyle(document.documentElement, {
        [GLOBAL_CLASS_NAMES.htmlHeight]: `${height.value}px`,
        [GLOBAL_CLASS_NAMES.htmlWidth]: `${width.value}px`,
      })
    })

    expose()
  },
  render() {
    return <div class="app-style-provider"></div>
  },
})
