import { mount } from '@vue/test-utils'

/**
 *
 * @param slots 需要传递的插槽
 *
 * @description
 * 创建一个包含 ref 为 domRef 的组件。
 * 并且允许传递插槽。
 *
 * @example
 * const wrapper = createRefElement({ default: () => <div>hello</div> })
 *
 * const text = wrapper.find('div').text() // hello
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const createRefElement = (slots?: Record<string, Function>) => {
  const wrapper = mount(
    defineComponent({
      setup() {
        const domRef = ref<HTMLElement>()

        return {
          domRef,
        }
      },
      render() {
        return <div ref="domRef">{{ ...slots }}</div>
      },
    }),
  )

  return wrapper
}

export default createRefElement
