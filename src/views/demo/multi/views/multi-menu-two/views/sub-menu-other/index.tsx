import { NInput } from 'naive-ui'

const SubMenuOther = defineComponent({
  name: 'SubMenuOther',
  setup() {
    const inputValue = ref(null)

    return {
      inputValue,
    }
  },
  render() {
    return (
      <div>
        多级菜单-2-1
        <NInput v-model={this.inputValue} />
      </div>
    )
  },
})

export default SubMenuOther
