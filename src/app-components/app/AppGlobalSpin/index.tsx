import { useRuntimeActions, useRuntimeGetters } from '@/store'
import { NSpin, spinProps } from 'naive-ui'
import type { SpinProps } from 'naive-ui'

const GlobalSpin = defineComponent({
  name: 'GlobalSpin',
  props: {
    ...spinProps,
  },
  setup() {
    const overrides = {
      opacitySpinning: '0.3',
    }
    const spinValue = useRuntimeGetters().globalSpinning

    return {
      spinValue,
      overrides,
    }
  },
  render() {
    return (
      <NSpin
        {...(this.$props as SpinProps)}
        show={this.spinValue}
        themeOverrides={this.overrides}
        style="height: var(--html-height)"
      >
        {{
          ...this.$slots,
        }}
      </NSpin>
    )
  },
})

export default GlobalSpin
