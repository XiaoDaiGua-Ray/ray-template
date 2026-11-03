import './index.scss'
import AppPageHeader from '@/app-components/app/AppPageHeader'

export default defineComponent({
  name: 'DemoPage',
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    eyebrow: { type: String, default: 'RAY TEMPLATE' },
    meta: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () => (
      <section class="r-showcase-page">
        <AppPageHeader
          title={props.title}
          description={props.description}
          eyebrow={props.eyebrow}
        >
          {props.meta ? (
            <span class="r-showcase-meta">{props.meta}</span>
          ) : null}
          {slots.actions?.()}
        </AppPageHeader>
        <div class="r-showcase-content">{slots.default?.()}</div>
      </section>
    )
  },
})
