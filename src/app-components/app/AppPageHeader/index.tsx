import './index.scss'

export default defineComponent({
  name: 'AppPageHeader',
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    eyebrow: { type: String, default: 'RAY TEMPLATE' },
  },
  setup(props, { slots }) {
    return () => (
      <header class="r-page-header">
        <div class="r-page-header__copy">
          <p class="r-page-header__eyebrow">{props.eyebrow}</p>
          <h1>{props.title}</h1>
          {props.description ? (
            <p class="r-page-header__description">{props.description}</p>
          ) : null}
        </div>
        {slots.default ? (
          <div class="r-page-header__actions">{slots.default()}</div>
        ) : null}
      </header>
    )
  },
})
