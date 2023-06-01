/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-01
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

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
      <div>
        多级菜单2-1-1
        <NInput v-model={this.inputValue} />
      </div>
    )
  },
})

export default MultiMenuTwoOne
