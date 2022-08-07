import { defineComponent } from 'vue'
import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue' // 以封装动画路由组件
import DraggableComponent from '@/components/DraggableComponent/index.vue'

const App = defineComponent({
  name: 'App',
  setup() {
    const draggableRef = ref<HTMLElement>()

    const { x, y } = useMouse()
    const { height: windowHeight } = useWindowSize()

    return {
      x,
      y,
      windowHeight,
    }
  },
  render() {
    return (
      <div
        class="app-wrapper"
        style={`height: ${this.windowHeight}px;font-size: 22px; color: #FDD192`}
      >
        hello! Welcome to this template!
        <h1>
          当前鼠标位置: x: {this.x}, y: {this.y}
        </h1>
        <DraggableComponent />
      </div>
    )
  },
})

export default App
