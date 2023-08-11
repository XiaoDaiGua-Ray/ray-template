import './index.scss'
import { NCard } from 'naive-ui'

const ScrollReveal = defineComponent({
  name: 'ScrollReveal',
  render() {
    return (
      <div class="scroll-reveal">
        <NCard title="提示">
          RayScrollReveal组件有点问题, 暂时移除. 不能正常的实现滚动动画.
          很是操蛋!!!
        </NCard>
      </div>
    )
  },
})

export default ScrollReveal
