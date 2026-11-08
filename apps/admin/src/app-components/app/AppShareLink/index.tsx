import './index.scss'
import { RAY_TEMPLATE_DOCS_URL } from '@/app-config'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import type { IconName } from '@/icons'
import type { PropType } from 'vue'

interface ShareLinkOption {
  key: string
  src: string
  tooltip: string
  icon: IconName
}

export default defineComponent({
  name: 'AppShareLink',
  props: {
    variant: {
      type: String as PropType<'compact' | 'cards'>,
      default: 'compact',
    },
  },
  setup() {
    const { t } = useI18n('dashboard')
    const links: ShareLinkOption[] = [
      {
        key: 'ray-js-note',
        src: 'https://note.youdao.com/s/ObWEe2BB',
        tooltip: 'links.notes',
        icon: 'navigation/form',
      },
      {
        key: 'ray-js-cover',
        src: 'https://note.youdao.com/s/IC8xKPdB',
        tooltip: 'links.interviews',
        icon: 'status/question',
      },
      {
        key: 'ray-template-doc',
        src: RAY_TEMPLATE_DOCS_URL,
        tooltip: 'links.docs',
        icon: 'navigation/document',
      },
      {
        key: 'ray-template-doc-out',
        src: 'https://ray-template.yunkuangao.com/',
        tooltip: 'links.docsMirror',
        icon: 'navigation/window',
      },
    ]

    return { links, t }
  },
  render() {
    return (
      <div class={['r-share-links', `r-share-links--${this.variant}`]}>
        <div class="r-share-links__grid">
          {this.links.map((item) => (
            <a
              class="r-share-link"
              href={item.src}
              aria-label={this.t<string>(item.tooltip)}
              title={this.t<string>(item.tooltip)}
              target="_blank"
              rel="noreferrer"
              key={item.key}
            >
              <span class="r-share-link__icon" aria-hidden="true">
                <RIcon name={item.icon} size={20} />
              </span>
              <span class="r-share-link__label">{this.t(item.tooltip)}</span>
              <RIcon
                class="r-share-link__arrow"
                name="action/external-link"
                size={14}
              />
            </a>
          ))}
        </div>
      </div>
    )
  },
})
