import { GLOBAL_CLASS_NAMES } from '@/app-config'
import { useSettingGetters } from '@/store'
import { createRayThemeStyle } from '@ray-template/ui/theme-presets'
import { useWindowSize } from '@vueuse/core'
import { useThemeVars } from 'naive-ui'

export default defineComponent({
  name: 'AppStyleProvider',
  setup() {
    const { getAppTheme, getPrimaryColorOverride } = useSettingGetters()
    const { height, width } = useWindowSize()
    const vars = useThemeVars()
    const html = document.documentElement
    const { darkClassName, lightClassName, htmlHeight, htmlWidth } =
      GLOBAL_CLASS_NAMES

    watchEffect(() => {
      html.classList.toggle(darkClassName, getAppTheme.value)
      html.classList.toggle(lightClassName, !getAppTheme.value)

      const styles = createRayThemeStyle(
        vars.value,
        getPrimaryColorOverride.value,
      )

      for (const [name, value] of Object.entries(styles)) {
        html.style.setProperty(name, value)
      }
    })

    watchEffect(() => {
      html.style.setProperty(htmlHeight, `${height.value}px`)
      html.style.setProperty(htmlWidth, `${width.value}px`)
    })

    return () => null
  },
})
