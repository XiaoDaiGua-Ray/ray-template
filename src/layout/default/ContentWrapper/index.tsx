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

import { useSetting } from '@/store'

const ContentWrapper = defineComponent({
  name: 'ContentWrapper',
  setup() {
    const settingStore = useSetting()

    const { reloadRouteSwitch } = storeToRefs(settingStore)

    return {
      reloadRouteSwitch,
    }
  },
  render() {
    return this.reloadRouteSwitch ? (
      <RayTransitionComponent class="content-wrapper" />
    ) : (
      <></>
    )
  },
})

export default ContentWrapper
