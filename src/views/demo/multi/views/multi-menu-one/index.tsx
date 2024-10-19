import { NInput } from 'naive-ui'

const MultiMenuOne = defineComponent({
  name: 'MultiMenuOne',
  setup() {
    const inputValue = ref(null)

    return {
      inputValue,
    }
  },
  render() {
    return (
      <div>
        多级菜单-1
        <NInput v-model={this.inputValue} />
      </div>
    )
  },
})

export default MultiMenuOne
