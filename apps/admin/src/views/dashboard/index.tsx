import './index.scss'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import AppShareLink from '@/app-components/app/AppShareLink'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import { useMenuGetters } from '@/store'
import type { AppMenuOption } from '@/types'
import { NCard, NDescriptions, NDescriptionsItem } from 'naive-ui'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'RDashboard',
  setup() {
    const { t } = useI18n('dashboard')
    const text = (key: string) => t<string>(key)
    const { getMenuOptions } = useMenuGetters()
    const shortcutsTitle = useId()
    const { dependencies, devDependencies } = __APP_CFG__.pkg
    const stack = [
      { name: 'Vue', version: dependencies.vue, detail: 'Composition API' },
      { name: 'Vite', version: devDependencies.vite, detail: 'Rolldown' },
      {
        name: 'TypeScript',
        version: devDependencies.typescript,
        detail: 'TSX',
      },
      {
        name: 'Pinia',
        version: dependencies.pinia,
        detail: text('stateManagement'),
      },
    ]
    const destinations = [
      {
        path: '/template-hooks',
        icon: 'action/setting',
        title: 'hooks',
        description: 'hooksDescription',
      },
      {
        path: '/layout-demo',
        icon: 'navigation/layout',
        title: 'layout',
        description: 'layoutDescription',
      },
      {
        path: '/svg-icons',
        icon: 'navigation/icons',
        title: 'icons',
        description: 'iconsDescription',
      },
    ] as const
    const shortcuts = computed(() => {
      const visiblePaths = new Set<string>()
      const collect = (menus: AppMenuOption[]) => {
        for (const menu of menus) {
          // 菜单树已经按角色过滤；隐藏任一祖先时，整条分支都不能成为快捷入口。
          if (menu.show === false) continue

          if (!menu.meta.windowOpen) visiblePaths.add(menu.fullPath)

          if (menu.children?.length) collect(menu.children)
        }
      }

      collect(getMenuOptions.value)

      return destinations.filter(({ path }) => visiblePaths.has(path))
    })

    return () => (
      <section class="r-dashboard">
        <AppPageHeader
          class="r-dashboard__header"
          title={text('title')}
          description={text('description')}
          eyebrow="RAY TEMPLATE / WORKSPACE"
        >
          <span class="r-dashboard__brand">
            <RIcon name="logo/ray" size={44} />
          </span>
        </AppPageHeader>
        <div class="r-dashboard-stack">
          {stack.map((item) => (
            <article key={item.name} class="r-dashboard-stack__item">
              <span>{item.name}</span>
              <strong>{item.version}</strong>
              <small>
                {item.name === 'Pinia' ? text('stateManagement') : item.detail}
              </small>
            </article>
          ))}
        </div>
        {shortcuts.value.length ? (
          <section aria-labelledby={shortcutsTitle}>
            <h2 id={shortcutsTitle} class="r-dashboard__section-title">
              {text('explore')}
            </h2>
            <nav class="r-dashboard-shortcuts" aria-labelledby={shortcutsTitle}>
              {shortcuts.value.map((item) => (
                <RouterLink
                  key={item.path}
                  to={item.path}
                  class="r-dashboard-shortcut"
                >
                  <span class="r-dashboard-shortcut__icon" aria-hidden="true">
                    <RIcon name={item.icon} size={20} />
                  </span>
                  <span class="r-dashboard-shortcut__copy">
                    <strong>{text(item.title)}</strong>
                    <small>{text(item.description)}</small>
                  </span>
                  <RIcon
                    class="r-dashboard-shortcut__arrow"
                    name="directional/right_arrow"
                    size={14}
                  />
                </RouterLink>
              ))}
            </nav>
          </section>
        ) : null}
        <div class="r-dashboard-info">
          <NCard title={text('project')}>
            <p class="r-dashboard-info__intro">{text('projectDescription')}</p>
            <div class="r-dashboard-features">
              <span>Vue 3 + TSX</span>
              <span>Naive UI</span>
              <span>{text('routing')}</span>
              <span>{text('themeAndLocale')}</span>
            </div>
            <p class="r-dashboard-info__feedback">
              {text('feedbackBefore')}{' '}
              <a
                href="https://github.com/XiaoDaiGua-Ray/ray-template/issues"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Issues <RIcon name="action/external-link" size={12} />
              </a>
              {text('feedbackAfter')}
            </p>
          </NCard>
          <NCard title={text('author')}>
            <NDescriptions
              column={1}
              labelPlacement="left"
              labelStyle={{ width: '92px' }}
            >
              <NDescriptionsItem label={text('frameworks')}>
                Vue3.x / React
              </NDescriptionsItem>
              <NDescriptionsItem label={text('experience')}>
                {text('experienceValue')}
              </NDescriptionsItem>
              <NDescriptionsItem label={text('bio')}>
                {text('bioValue')}
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>
        </div>
        <NCard title={text('linksTitle')}>
          <AppShareLink variant="cards" />
        </NCard>
      </section>
    )
  },
})
