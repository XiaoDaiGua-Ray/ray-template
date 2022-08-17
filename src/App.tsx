import { defineComponent } from 'vue'
import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue' // 以封装动画路由组件
import DraggableComponent from '@/components/DraggableComponent/index.vue'
import RayScrollReveal from '@/components/RayScrollReveal/index'
import { useAxiosTest } from '@use-api/test'
import R from '@/icons/ray.svg' // 使用 vite-svg-loader 作为 svg 使用插件, 故而不需要使用 RayIcon 作为组件引入

const App = defineComponent({
  name: 'App',
  setup() {
    const { x, y } = useMouse()
    const { height: windowHeight } = useWindowSize()
    const { t } = useI18n()
    const inputRef = ref<HTMLInputElement>()

    const handleFileChange = () => {
      const file = (inputRef.value as HTMLInputElement).files?.[0]

      useAxiosTest(file as File)
    }

    return {
      x,
      y,
      windowHeight,
      ray: t,
      handleFileChange,
      inputRef,
    }
  },
  render() {
    return (
      <div
        class="app-wrapper"
        style={`height: ${this.windowHeight}px;font-size: 22px; color: #FDD192;padding: 20px;`}
      >
        <R style="width: 24px; height: 24px;" />
        hello! Welcome to this template!
        <h1>
          当前鼠标位置: x: {this.x}, y: {this.y} {this.ray('Test')}
        </h1>
        <DraggableComponent />
        {Array.from({ length: 10 }, (_, i) => i).map((_, idx) => (
          <RayScrollReveal>
            <div
              style={`width: 100%; height: 300px;border: 1px solid #FDD192;margin: 20px;background: #e7f5ee;`}
            >
              {idx}
            </div>
          </RayScrollReveal>
        ))}
      </div>
    )
  },
})

export default App
