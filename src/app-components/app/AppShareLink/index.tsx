import './index.scss'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { NAvatar } from 'naive-ui'
import type { PropType } from 'vue'

interface AvatarOptions {
  key: string
  src: string
  tooltip: string
  icon: string
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
    const avatarOptions: AvatarOptions[] = [
      {
        key: 'ray-js-note',
        src: 'https://note.youdao.com/s/ObWEe2BB',
        tooltip: 'links.notes',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
      {
        key: 'ray-js-cover',
        src: 'https://note.youdao.com/s/IC8xKPdB',
        tooltip: 'links.interviews',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
      {
        key: 'ray-template-doc',
        src: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
        tooltip: 'links.docs',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
      {
        key: 'ray-template-doc-out',
        src: 'https://ray-template.yunkuangao.com/',
        tooltip: 'links.docsMirror',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
    ]

    return { avatarOptions, t }
  },
  render() {
    return (
      <div class={['r-share-links', `r-share-links--${this.variant}`]}>
        <div class="r-share-links__grid">
          {this.avatarOptions.map((item) => (
            <a
              class="r-share-link"
              href={item.src}
              aria-label={this.t<string>(item.tooltip)}
              title={this.t<string>(item.tooltip)}
              target="_blank"
              rel="noreferrer"
              key={item.key}
            >
              <NAvatar round src={item.icon} size={24} />
              <span>{this.t(item.tooltip)}</span>
              <RIcon name="action/shared" size={13} />
            </a>
          ))}
        </div>
      </div>
    )
  },
})
