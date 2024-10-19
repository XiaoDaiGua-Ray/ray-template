import { NInput } from 'naive-ui'

const MultiMenuTwoOne = defineComponent({
  name: 'MultiMenuTwoOne',
  setup() {
    const inputValue = ref(null)

    return {
      inputValue,
    }
  },
  render() {
    return (
      <div
        style={{
          height: 'var(--layout-content-height)',
        }}
      >
        多级菜单2-2-1
        <NInput v-model={this.inputValue} />
      </div>
    )
  },
})

export default MultiMenuTwoOne
