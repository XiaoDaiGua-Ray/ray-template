import { NFlex } from 'naive-ui'
import SiderBar from '@/layout/components/SiderBar'

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
