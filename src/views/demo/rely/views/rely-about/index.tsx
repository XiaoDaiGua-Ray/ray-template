import './index.scss'
import { useI18n } from '@/hooks'
import {
  NButton,
  NCard,
  NFlex,
  NInput,
  NRadioButton,
  NRadioGroup,
  NTag,
} from 'naive-ui'
import DemoPage from '../../../components/DemoPage'

export default defineComponent({
  name: 'RelyAbout',
  setup() {
    const { t } = useI18n('demoDetails')
    const { dependencies, devDependencies, name, version } = __APP_CFG__.pkg
    const groups = { runtime: dependencies, development: devDependencies }
    const scope = ref<keyof typeof groups>('runtime')
    const query = ref('')
    const packages = computed(() =>
      Object.entries(groups[scope.value]).filter(([pkg]) =>
        pkg.toLowerCase().includes(query.value.trim().toLowerCase()),
      ),
    )

    return () => (
      <DemoPage title={t('about.title')} description={t('about.intro')}>
        {{
          actions: () => (
            <NButton
              tag="a"
              {...{
                href: 'https://github.com/XiaoDaiGua-Ray/ray-template',
                target: '_blank',
                rel: 'noreferrer',
              }}
              secondary
            >
              GitHub
            </NButton>
          ),
          default: () => (
            <NCard title={name} class="rely-about">
              {{
                'header-extra': () => (
                  <NTag bordered={false} type="info">
                    v{version}
                  </NTag>
                ),
                default: () => (
                  <div class="r-demo-card-stack">
                    <NFlex align="center" justify="space-between">
                      <NRadioGroup
                        v-model:value={scope.value}
                        aria-label={t('about.group')}
                      >
                        <NRadioButton value="runtime">
                          {t('about.runtime')}
                        </NRadioButton>
                        <NRadioButton value="development">
                          {t('about.development')}
                        </NRadioButton>
                      </NRadioGroup>
                      <NInput
                        class="rely-about__search"
                        v-model:value={query.value}
                        placeholder={t('about.search')}
                        inputProps={{ 'aria-label': t('about.search') }}
                        clearable
                      />
                    </NFlex>
                    {packages.value.length ? (
                      <ul class="rely-about__packages">
                        {packages.value.map(([pkg, installed]) => (
                          <li key={pkg}>
                            <code>{pkg}</code>
                            <NTag size="small" bordered={false}>
                              {installed}
                            </NTag>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p role="status">{t('about.noMatch')}</p>
                    )}
                  </div>
                ),
              }}
            </NCard>
          ),
        }}
      </DemoPage>
    )
  },
})
