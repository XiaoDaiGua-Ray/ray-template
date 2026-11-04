import './index.scss'
import { NCard } from 'naive-ui'
import DemoPage from '../components/DemoPage'

export default defineComponent({
  name: 'ScrollReveal',
  render() {
    return (
      <DemoPage
        title={this.$t('menu.scrollReveal')}
        description={this.$t('showcase.scrollDescription')}
        eyebrow="RAY TEMPLATE / EXAMPLES"
      >
        <div class="scroll-reveal">
          {Array.from({ length: 6 }, (_, index) => (
            <NCard key={index}>
              <strong class="scroll-reveal__number">
                {String(index + 1).padStart(2, '0')}
              </strong>
              <p>{this.$t('showcase.scrollCard', { index: index + 1 })}</p>
            </NCard>
          ))}
        </div>
      </DemoPage>
    )
  },
})
