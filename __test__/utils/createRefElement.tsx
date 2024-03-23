import { mount } from '@vue/test-utils'

import type { Slot } from 'vue'

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
