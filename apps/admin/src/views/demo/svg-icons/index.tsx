import './index.scss'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { iconNames, iconPackages } from '@/icons'
import { NCard, NEmpty, NInput, NSelect } from 'naive-ui'
import DemoPage from '../components/DemoPage'

export default defineComponent({
  name: 'PreviewSVGIcons',
  setup() {
    const { t } = useI18n('icons')
    const { t: showcaseT } = useI18n('showcase')
    const query = ref('')
    const selectedPackage = ref<string | null>(null)
    const filtered = computed(() =>
      iconNames.filter(
        (name) =>
          (!selectedPackage.value ||
            name.startsWith(`${selectedPackage.value}/`)) &&
          name.includes(query.value.trim().toLowerCase()),
      ),
    )
    const groups = computed(() =>
      iconPackages
        .map((name) => ({
          name,
          icons: filtered.value.filter((icon) => icon.startsWith(`${name}/`)),
        }))
        .filter((group) => group.icons.length),
    )

    return () => (
      <DemoPage
        title={t<string>('title')}
        description={t<string>('description')}
        eyebrow={showcaseT<string>('iconsEyebrow')}
        meta={`${iconNames.length} SVG / ${iconPackages.length} ${t<string>('packagesLabel')}`}
      >
        <NCard class="r-icon-library">
          <div class="r-icon-library__toolbar">
            <NInput
              class="r-icon-library__search"
              value={query.value}
              onUpdateValue={(value) => {
                query.value = value
              }}
              placeholder={t<string>('search')}
              inputProps={{ 'aria-label': t<string>('search') }}
              clearable
            >
              {{ prefix: () => <RIcon name="action/search" size={16} /> }}
            </NInput>
            <NSelect
              class="r-icon-library__filter"
              value={selectedPackage.value}
              onUpdateValue={(value: string | null) => {
                selectedPackage.value = value
              }}
              options={iconPackages.map((value) => ({ label: value, value }))}
              clearable
              placeholder={t<string>('allPackages')}
            />
          </div>
          <div class="r-icon-library__hint">
            <span>{t('copy')}</span>
            <span>
              {filtered.value.length} / {iconNames.length}
            </span>
          </div>
          {groups.value.map((group) => (
            <section class="r-icon-library__group" key={group.name}>
              <header>
                <h2>{group.name}</h2>
                <span>{group.icons.length}</span>
              </header>
              <div class="pre-view-icons__grid">
                {group.icons.map((name) => (
                  <button
                    type="button"
                    class="pre-view-icons__card"
                    key={name}
                    title={name}
                    aria-label={name}
                    v-copy={`<RIcon name="${name}" />`}
                  >
                    <RIcon name={name} size={28} cursor="pointer" />
                    <span>{name.split('/').slice(1).join('/')}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
          {!filtered.value.length ? (
            <NEmpty description={t<string>('empty')} />
          ) : null}
        </NCard>
      </DemoPage>
    )
  },
})
