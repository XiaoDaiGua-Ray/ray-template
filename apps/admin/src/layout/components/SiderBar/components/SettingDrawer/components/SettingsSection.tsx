export default defineComponent({
  name: 'SettingsSection',
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    const id = useId()

    return () => (
      <section class="r-settings-section" aria-labelledby={id}>
        <div class="r-settings-section__heading">
          <h3 id={id}>{props.title}</h3>
          {slots.action?.()}
        </div>
        {slots.default?.()}
      </section>
    )
  },
})
