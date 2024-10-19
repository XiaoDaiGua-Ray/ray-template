import { RIframe } from '@/components'

const RTemplateDoc = defineComponent({
  name: 'RTemplateDoc',
  setup() {
    return {}
  },
  render() {
    return (
      <RIframe
        width="100%"
        height="100%"
        src="https://xiaodaigua-ray.github.io/ray-template-doc/"
        lazy
      ></RIframe>
    )
  },
})

export default RTemplateDoc
