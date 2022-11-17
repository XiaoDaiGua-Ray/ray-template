import { defineComponent } from 'vue'

const App = defineComponent({
  name: 'App',
  setup() {
    const { height: windowHeight } = useWindowSize()
    const numRef = ref(1)

    window?.$wujie?.bus.$on('addState', (val: number) => {
      numRef.value += val
    })

    return {
      windowHeight,
      numRef,
    }
  },
  render() {
    return (
      <div
        class="app-wrapper"
        style={`height: ${this.windowHeight}px;font-size: 22px; color: #FDD192;padding: 20px;`}
      >
        <p>这个页面是保持激活状态</p>
        <p>当前计数: {this.numRef}</p>
      </div>
    )
  },
})

export default App
