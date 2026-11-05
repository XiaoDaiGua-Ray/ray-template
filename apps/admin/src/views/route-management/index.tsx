import './index.scss'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { useI18n } from '@/hooks'
import { getStaticAppRoutes } from '@/router/app-route-modules'
import { exportRouteConfig, parseRouteConfig } from '@/router/config/contract'
import type { RouteConfig } from '@/router/config/schema'
import {
  fetchRemoteRouteConfig,
  remoteRouteUrl,
  routeSourceStatus,
  saveRemoteRouteConfig,
  saveRouteSource,
} from '@/router/config/source'
import type { RouteSource } from '@/router/config/source'
import { routeViewCatalog } from '@/router/config/views'
import { joinRoutePath } from '@/router/utils/join-route-path'
import {
  NAlert,
  NButton,
  NCard,
  NFlex,
  NFormItem,
  NInput,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NTag,
} from 'naive-ui'
import { downloadJson } from './download-json'

export default defineComponent({
  name: 'RouteManagement',
  setup() {
    const { t } = useI18n('routeManagement')
    const source = ref<RouteSource>(routeSourceStatus.requested)
    const draft = ref('')
    const checked = shallowRef<RouteConfig>()
    const error = ref('')
    const busy = ref(false)
    const file = useTemplateRef<HTMLInputElement>('file')
    const editorId = useId()
    const resultId = useId()
    const pathId = useId()
    const titleId = useId()
    const viewId = useId()
    const newPage = reactive({ path: '', title: '', component: 'dashboard' })
    const viewOptions = routeViewCatalog.map(({ id }) => ({
      label: id,
      value: id,
    }))

    const report = (reason: unknown) => {
      checked.value = void 0
      error.value = reason instanceof Error ? reason.message : String(reason)
    }
    const setDraft = (config: RouteConfig) => {
      draft.value = JSON.stringify(config, null, 2)
      checked.value = config
      error.value = ''
    }
    const loadStatic = () => {
      try {
        setDraft(exportRouteConfig(getStaticAppRoutes()))
      } catch (reason) {
        report(reason)
      }
    }

    if (routeSourceStatus.config) setDraft(routeSourceStatus.config)
    else loadStatic()

    const validate = () => {
      try {
        const config = parseRouteConfig(draft.value)

        checked.value = config
        error.value = ''

        return config
      } catch (reason) {
        report(reason)
      }
    }
    const addPage = (event: Event) => {
      event.preventDefault()
      const config = validate()

      if (!config) return

      const page = {
        path: newPage.path.trim(),
        component: newPage.component,
        meta: { noLocalTitle: newPage.title.trim() },
      }

      try {
        setDraft(
          parseRouteConfig(
            JSON.stringify({ ...config, routes: [...config.routes, page] }),
          ),
        )
        newPage.path = ''
        newPage.title = ''

        if (source.value === 'static') source.value = 'remote'
      } catch (reason) {
        report(reason)
      }
    }

    const readFile = async (event: Event) => {
      const input = event.currentTarget as HTMLInputElement
      const selected = input.files?.[0]

      if (!selected) return

      try {
        if (selected.size > 256 * 1024) throw new Error(t('fileLimit'))

        draft.value = await selected.text()

        if (source.value === 'static') source.value = 'remote'

        validate()
      } catch (reason) {
        report(reason)
      } finally {
        input.value = ''
      }
    }
    const loadRemote = async () => {
      busy.value = true

      try {
        setDraft(await fetchRemoteRouteConfig())
      } catch (reason) {
        report(reason)
      } finally {
        busy.value = false
      }
    }
    const apply = async () => {
      if (busy.value) return

      const config = source.value !== 'static' ? validate() : void 0

      if (source.value !== 'static' && !config) return

      try {
        busy.value = true

        if (source.value === 'remote' && config)
          await saveRemoteRouteConfig(config)
        else saveRouteSource(source.value, config)
      } catch (reason) {
        report(reason)
      } finally {
        busy.value = false
      }
    }

    const summary = computed(() => {
      const entries: { path: string; component: string; depth: number }[] = []
      const visit = (
        records: RouteConfig['routes'],
        parent = '',
        depth = 0,
      ) => {
        for (const route of records) {
          const path = joinRoutePath(parent, route.path)

          entries.push({
            path,
            component:
              route.component ??
              route.redirect ??
              (route.children ? t('group') : t('external')),
            depth,
          })

          if (route.children) visit(route.children, path, depth + 1)
        }
      }

      if (checked.value) visit(checked.value.routes)

      return entries
    })

    return () => (
      <section class="route-management">
        <AppPageHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        >
          <NTag
            type={routeSourceStatus.error ? 'warning' : 'info'}
            bordered={false}
          >
            {t('active', { source: t(routeSourceStatus.active) })}
          </NTag>
        </AppPageHeader>

        {routeSourceStatus.error && (
          <NAlert type="warning" title={t('fallback')}>
            {routeSourceStatus.error}
          </NAlert>
        )}

        <NCard title={t('source')}>
          <NFlex align="center" justify="space-between">
            <NRadioGroup v-model:value={source.value} aria-label={t('source')}>
              <NRadioButton value="static">{t('static')}</NRadioButton>
              <NRadioButton value="local">{t('local')}</NRadioButton>
              <NRadioButton value="remote" disabled={!remoteRouteUrl}>
                {t('remote')}
              </NRadioButton>
            </NRadioGroup>
            <NButton
              type="primary"
              onClick={apply}
              disabled={
                busy.value || (source.value === 'remote' && !remoteRouteUrl)
              }
            >
              {t('apply')}
            </NButton>
          </NFlex>
          <p class="route-management__hint">{t(`${source.value}Hint`)}</p>
          {remoteRouteUrl && (
            <code class="route-management__endpoint">{remoteRouteUrl}</code>
          )}
        </NCard>

        <div class="route-management__workspace">
          <NCard title={t('manifest')}>
            <NFlex class="route-management__tools">
              <NButton size="small" onClick={loadStatic}>
                {t('loadStatic')}
              </NButton>
              {remoteRouteUrl && (
                <NButton size="small" loading={busy.value} onClick={loadRemote}>
                  {t('loadRemote')}
                </NButton>
              )}
              <NButton size="small" onClick={() => file.value?.click()}>
                {t('import')}
              </NButton>
              <input
                ref="file"
                type="file"
                accept=".json,application/json"
                hidden
                onChange={readFile}
              />
              <NButton
                size="small"
                onClick={() => {
                  const config = validate()

                  if (config) downloadJson('routes.json', config)
                }}
              >
                {t('export')}
              </NButton>
            </NFlex>
            <details class="route-management__add">
              <summary>{t('quickAdd')}</summary>
              <form onSubmit={addPage} autocomplete="off">
                <NFormItem
                  label={t('pagePath')}
                  labelProps={{ for: pathId }}
                  showFeedback={false}
                >
                  <NInput
                    v-model:value={newPage.path}
                    placeholder="/reports"
                    inputProps={{ id: pathId, required: true }}
                  />
                </NFormItem>
                <NFormItem
                  label={t('pageTitle')}
                  labelProps={{ for: titleId }}
                  showFeedback={false}
                >
                  <NInput
                    v-model:value={newPage.title}
                    inputProps={{ id: titleId, required: true }}
                  />
                </NFormItem>
                <NFormItem
                  label={t('pageView')}
                  labelProps={{ id: viewId }}
                  showFeedback={false}
                >
                  <NSelect
                    v-model:value={newPage.component}
                    options={viewOptions}
                    filterable
                    aria-labelledby={viewId}
                  />
                </NFormItem>
                <NButton attrType="submit" secondary type="primary">
                  {t('addPage')}
                </NButton>
              </form>
            </details>
            <NFormItem
              label={t('editor')}
              labelProps={{ for: editorId }}
              showFeedback={false}
            >
              <NInput
                class="route-management__editor"
                type="textarea"
                value={draft.value}
                rows={19}
                inputProps={{
                  id: editorId,
                  spellcheck: false,
                  'aria-describedby': resultId,
                }}
                onUpdateValue={(value) => {
                  draft.value = value
                  checked.value = void 0
                  error.value = ''
                }}
              />
            </NFormItem>
            <NFlex align="center" class="route-management__tools">
              <NButton type="primary" secondary onClick={validate}>
                {t('validate')}
              </NButton>
              <span id={resultId} role="status">
                {checked.value
                  ? t('valid', { count: summary.value.length })
                  : t('editHint')}
              </span>
            </NFlex>
            {error.value && (
              <NAlert type="error" title={t('invalid')}>
                <pre class="route-management__error">{error.value}</pre>
              </NAlert>
            )}
          </NCard>

          <NCard title={t('contract')} class="route-management__contract">
            <p>{t('contractHint')}</p>
            <NFlex>
              <NButton
                size="small"
                onClick={async () => {
                  try {
                    const { getRouteJsonSchema } =
                      await import('@/router/config/json-schema')

                    downloadJson(
                      'route-config.schema.json',
                      getRouteJsonSchema(),
                    )
                  } catch (reason) {
                    report(reason)
                  }
                }}
              >
                JSON Schema
              </NButton>
              <NButton
                size="small"
                onClick={() =>
                  downloadJson('route-views.json', routeViewCatalog)
                }
              >
                {t('views')}
              </NButton>
            </NFlex>
            <h3>{t('preview')}</h3>
            {summary.value.length > 0 ? (
              <ul class="route-management__routes">
                {summary.value.map(({ path, component, depth }, index) => (
                  <li
                    key={index}
                    style={{
                      paddingInlineStart: `${Math.min(depth, 4) * 12 + 8}px`,
                    }}
                  >
                    <code>{path}</code>
                    <small>{component}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t('previewEmpty')}</p>
            )}
          </NCard>
        </div>
      </section>
    )
  },
})
