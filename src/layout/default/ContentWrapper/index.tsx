/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-21
 *
 * @workspace ray-template-mine
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue'
import { NSpin } from 'naive-ui'

import { useSetting } from '@/store'

import type { GlobalThemeOverrides } from 'naive-ui'

const ContentWrapper = defineComponent({
  name: 'ContentWrapper',
  setup() {
    const settingStore = useSetting()
    const router = useRouter()

    const { reloadRouteSwitch } = storeToRefs(settingStore)
    const spinning = ref(false)
    const thmeOverridesSpin: GlobalThemeOverrides['Spin'] = {
      opacitySpinning: '0',
    }

    const setupLayoutContentSpin = () => {
      router.beforeEach(() => {
        spinning.value = true
      })

      router.afterEach(() => {
        setTimeout(() => {
          spinning.value = false
        }, 300)
      })
    }

    setupLayoutContentSpin()

    return {
      reloadRouteSwitch,
      spinning,
      thmeOverridesSpin,
    }
  },
  render() {
    return this.reloadRouteSwitch ? (
      <NSpin
        show={this.spinning}
        description="loading..."
        size="large"
        themeOverrides={this.thmeOverridesSpin}
      >
        <RayTransitionComponent class="content-wrapper" />
      </NSpin>
    ) : (
      <></>
    )
  },
})

export default ContentWrapper
