export default defineComponent({
  name: 'SettingsSection',
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    const id = useId()

    return () => (
      <section class="r-settings-section" aria-labelledby={id}>
        <h3 id={id}>{props.title}</h3>
        {slots.default?.()}
      </section>
    )
  },
})
