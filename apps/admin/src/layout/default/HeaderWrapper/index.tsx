import SiderBar from '@/layout/components/SiderBar'
import { NFlex } from 'naive-ui'

export default defineComponent({
  name: 'LayoutHeaderWrapper',
  setup() {
    return {}
  },
  render() {
    return (
      <NFlex size={[0, 0]}>
        <SiderBar />
      </NFlex>
    )
  },
})
