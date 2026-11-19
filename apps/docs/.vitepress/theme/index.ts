import { useData, withBase } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { defineComponent, h } from 'vue'
import { version } from '../source.mts'
import './ray.css'
import './demo.css'

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    setup() {
      const { localeIndex, page } = useData()

      return () =>
        h(DefaultTheme.Layout, null, {
          'doc-before': () => {
            const english = localeIndex.value === 'en'
            const prefix = english ? '/en' : ''
            const path = page.value.relativePath.replace(/^en\//, '')
            const section = path.startsWith('guide/')
              ? { zh: '开发指南', en: 'Development guide' }
              : path.startsWith('reference/')
                ? { zh: '参考', en: 'Reference' }
                : { zh: '版本迁移', en: 'Migration' }

            return h('div', { class: 'ray-doc-meta' }, [
              h('span', english ? section.en : section.zh),
              path !== 'reference/source.md'
                ? h(
                    'a',
                    { href: withBase(prefix + '/reference/source.html') },
                    [english ? 'Version ' : '版本 ', h('code', version)],
                  )
                : null,
            ])
          },
        })
    },
  }),
}
