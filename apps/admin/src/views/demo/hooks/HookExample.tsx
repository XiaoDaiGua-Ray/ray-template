import './index.scss'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { NButton, NCard } from 'naive-ui'

export default defineComponent({
  name: 'HookExample',
  props: {
    name: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
  },
  setup(props, { slots }) {
    const { t } = useI18n('showcase')

    return () => (
      <NCard tag="article" class="r-hook-example" contentStyle={{ padding: 0 }}>
        <header class="r-hook-example__header">
          <span class="r-hook-example__symbol" aria-hidden="true">
            ƒ
          </span>
          <h2>{props.name}</h2>
          <span class="r-hook-example__type">Hook</span>
        </header>
        <p class="r-hook-example__description">{props.description}</p>
        <div class="r-hook-preview">
          <span class="r-hook-preview__label">{t('preview')}</span>
          {slots.default?.()}
        </div>
        <details class="r-hook-code">
          <summary>
            <span>
              <RIcon name="directional/expanded" size={12} />
              {t('code')}
            </span>
            <span class="r-hook-code__format">TS / TSX</span>
          </summary>
          <div class="r-hook-code__toolbar">
            <span>TypeScript</span>
            <NButton text size="tiny" v-copy={props.code}>
              {t('copyCode')}
            </NButton>
          </div>
          <pre class="r-demo-code">
            <code>{props.code}</code>
          </pre>
        </details>
      </NCard>
    )
  },
})
