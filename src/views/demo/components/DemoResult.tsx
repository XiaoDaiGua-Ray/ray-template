export default defineComponent({
  name: 'DemoResult',
  props: {
    label: { type: String, required: true },
    error: Boolean,
  },
  setup(props, { slots }) {
    return () => (
      <div
        class={['r-demo-result', { 'r-demo-result--error': props.error }]}
        role="status"
      >
        <span class="r-demo-result__label">{props.label}</span>
        <div class="r-demo-result__value">{slots.default?.()}</div>
      </div>
    )
  },
})
