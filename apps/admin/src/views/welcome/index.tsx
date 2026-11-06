import './index.scss'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { useMenuGetters, useNavigationHistoryGetters } from '@/store'
import type { AppMenuOption } from '@/types'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'RWelcome',
  setup() {
    const { t } = useI18n('workspaceStates')
    const { t: translate } = useI18n()
    const { getMenuOptions } = useMenuGetters()
    const { recentPaths } = useNavigationHistoryGetters()
    const shortcutsTitle = useId()
    const label = (option: AppMenuOption) =>
      option.meta.i18nKey
        ? translate(option.meta.i18nKey)
        : String(
            option.meta.noLocalTitle ?? option.breadcrumbLabel ?? option.name,
          )
    const shortcuts = computed(() => {
      const leaves: { option: AppMenuOption; parent?: AppMenuOption }[] = []
      const collect = (items: AppMenuOption[], parent?: AppMenuOption) => {
        for (const option of items) {
          if (
            option.show === false ||
            option.meta.hidden ||
            option.meta.sameLevel
          )
            continue

          if (option.children?.length) collect(option.children, option)
          else if (!option.meta.windowOpen && !option.fullPath.includes(':'))
            leaves.push({ option, parent })
        }
      }

      collect(getMenuOptions.value)
      const byPath = new Map(
        leaves.map((entry) => [entry.option.fullPath, entry]),
      )
      // 历史记录只用于排序；可见入口始终来自当前账号、当前路由源的菜单树。
      const recent = recentPaths.value.flatMap((path) => {
        const entry = byPath.get(path)

        return entry ? [entry] : []
      })
      const recentSet = new Set(recent.map(({ option }) => option.fullPath))

      return [
        ...recent,
        ...leaves.filter(({ option }) => !recentSet.has(option.fullPath)),
      ]
        .slice(0, 6)
        .map((entry) => ({
          ...entry,
          recent: recentSet.has(entry.option.fullPath),
        }))
    })

    return () => (
      <section class="r-welcome">
        <div class="r-welcome__intro">
          <div class="r-welcome__mark" aria-hidden="true">
            <RIcon name="navigation/window" size={36} />
          </div>
          <AppPageHeader
            eyebrow={t('welcome.eyebrow')}
            title={t('welcome.title')}
            description={t('welcome.description')}
          />
        </div>
        {shortcuts.value.length ? (
          <nav class="r-welcome__destinations" aria-labelledby={shortcutsTitle}>
            <h2 id={shortcutsTitle}>{t('welcome.shortcuts')}</h2>
            <ul class="r-welcome__grid" role="list">
              {shortcuts.value.map(({ option, parent, recent }) => (
                <li key={option.fullPath}>
                  <RouterLink to={option.fullPath} class="r-welcome__link">
                    <span class="r-welcome__icon" aria-hidden="true">
                      <RIcon
                        name={
                          typeof option.meta.icon === 'string'
                            ? option.meta.icon
                            : 'navigation/window'
                        }
                        size={22}
                      />
                    </span>
                    <span class="r-welcome__link-copy">
                      <strong>{label(option)}</strong>
                      <span>
                        {recent
                          ? t('welcome.recent')
                          : parent
                            ? label(parent)
                            : t('welcome.openPage')}
                      </span>
                    </span>
                    <span class="r-welcome__arrow" aria-hidden="true">
                      →
                    </span>
                  </RouterLink>
                </li>
              ))}
            </ul>
            <p class="r-welcome__hint">{t('welcome.navigationHint')}</p>
          </nav>
        ) : (
          <div class="r-welcome__empty">
            <h2>{t('welcome.noPagesTitle')}</h2>
            <p>{t('welcome.noPagesDescription')}</p>
          </div>
        )}
      </section>
    )
  },
})
