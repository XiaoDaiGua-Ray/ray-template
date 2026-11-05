import './index.scss'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { useAccess, useI18n } from '@/hooks'
import { getStaticAppRoutes } from '@/router/app-route-modules'
import { exportRouteConfig, parseRouteConfig } from '@/router/config/contract'
import type { RouteConfigRecord } from '@/router/config/schema'
import {
  fetchRemoteRouteConfig,
  routeSourceStatus,
  saveRemoteRouteConfig,
} from '@/router/config/source'
import { findRouteView, routeViewCatalog } from '@/router/config/views'
import { joinRoutePath } from '@/router/utils/join-route-path'
import { orderRoutes } from '@/router/utils/order-routes'
import {
  NAlert,
  NButton,
  NCard,
  NDropdown,
  NFlex,
  NFormItem,
  NInput,
  NPopconfirm,
  NSelect,
  NSwitch,
  NTag,
  NTree,
} from 'naive-ui'
import type { TreeOption } from 'naive-ui'
import { downloadJson } from './download-json'

type Kind = 'page' | 'group' | 'redirect' | 'external'

const kinds: Kind[] = ['page', 'group', 'redirect', 'external']
const viewOptions = routeViewCatalog.map(({ id }) => ({ label: id, value: id }))
const getKind = (record: RouteConfigRecord): Kind =>
  record.children
    ? 'group'
    : record.component
      ? 'page'
      : record.redirect !== void 0
        ? 'redirect'
        : 'external'

export default defineComponent({
  name: 'RouteManagementVisual',
  setup() {
    const { t } = useI18n('routeManagement')
    const { hasPermission } = useAccess()
    const saving = ref(false)
    const text = (key: string) => t<string>(key)
    const { t: translate } = useI18n()
    const records = ref<RouteConfigRecord[]>([])
    const selected = ref<number>()
    const expanded = ref<(string | number)[]>([])
    const error = ref('')
    const valid = ref(false)
    const ids = new WeakMap<RouteConfigRecord, number>()
    let sequence = 0
    const id = useId()
    const keyFor = (record: RouteConfigRecord) => {
      const key = ids.get(record) ?? ++sequence

      ids.set(record, key)

      return key
    }
    const tree = computed(() => {
      const entries = new Map<
        number,
        {
          record: RouteConfigRecord
          siblings: RouteConfigRecord[]
          index: number
          path: string
        }
      >()
      const visit = (list: RouteConfigRecord[], parent = ''): TreeOption[] =>
        list.map((record, index) => {
          const key = keyFor(record)
          const path = joinRoutePath(parent, record.path)
          const { i18nKey, noLocalTitle } = record.meta
          const label = i18nKey ? translate(i18nKey) : noLocalTitle

          entries.set(key, { record, siblings: list, index, path })

          return {
            key,
            label: `${label || text(`kind.${getKind(record)}`)} · ${path}`,
            children: record.children && visit(record.children, path),
          }
        })
      const options = visit(records.value)

      return { entries, options }
    })
    const current = computed(() => tree.value.entries.get(selected.value ?? 0))
    const clearResult = () => {
      error.value = ''
      valid.value = false
    }
    const report = (reason: unknown) => {
      error.value = reason instanceof Error ? reason.message : String(reason)
      valid.value = false
    }
    const load = async () => {
      try {
        const config =
          routeSourceStatus.active === 'remote'
            ? await fetchRemoteRouteConfig()
            : (routeSourceStatus.config ??
              exportRouteConfig(getStaticAppRoutes()))

        records.value = orderRoutes(structuredClone(config.routes))
        selected.value = tree.value.options[0]?.key as number | undefined
        expanded.value = []
        clearResult()
      } catch (reason) {
        report(reason)
      }
    }

    watch(records, clearResult, { deep: true })
    void load()

    const validate = () => {
      try {
        const config = parseRouteConfig(
          JSON.stringify({ version: 1, routes: records.value }),
        )

        valid.value = true
        error.value = ''

        return config
      } catch (reason) {
        report(reason)
      }
    }
    const apply = async () => {
      if (saving.value || !hasPermission('routes:write')) return

      const config = validate()

      if (!config) return

      try {
        saving.value = true
        await saveRemoteRouteConfig(config)
      } catch (reason) {
        report(reason)
      } finally {
        saving.value = false
      }
    }
    const add = (kind: Kind, parent?: RouteConfigRecord) => {
      const list = parent?.children ?? records.value
      const record: RouteConfigRecord = {
        path: '',
        meta: {},
      }

      if (kind === 'page') record.component = 'dashboard'

      if (kind === 'group') {
        record.component = 'layout'
        record.children = []
      }

      if (kind === 'redirect') record.redirect = ''

      if (kind === 'external') record.meta.windowOpen = ''

      if (!parent && list.length)
        record.meta.order = (list.at(-1)?.meta.order ?? 0) + 1

      list.push(record)
      selected.value = keyFor(list[list.length - 1])

      if (parent && !expanded.value.includes(keyFor(parent)))
        expanded.value.push(keyFor(parent))
    }
    const move = (offset: number) => {
      if (!current.value) return

      const { record, siblings, index } = current.value
      const next = index + offset

      if (next < 0 || next >= siblings.length) return

      siblings.splice(index, 1)
      siblings.splice(next, 0, record)

      // 顶级菜单运行时按 order 排序，移动后让顺序与树一致。
      if (siblings === records.value)
        siblings.forEach((item, index) => (item.meta.order = index))
    }
    const remove = () => {
      if (!current.value) return

      const { siblings, index } = current.value

      siblings.splice(index, 1)
      const next = siblings[Math.min(index, siblings.length - 1)]

      selected.value = next ? keyFor(next) : void 0
    }
    const input = (
      field: string,
      value: string,
      update: (value: string) => void,
    ) => (
      <NFormItem label={text(field)} labelProps={{ for: `${id}-${field}` }}>
        <NInput
          value={value}
          inputProps={{ id: `${id}-${field}` }}
          onUpdateValue={update}
        />
      </NFormItem>
    )
    const addMenu = (label: string, parent?: RouteConfigRecord) => (
      <NDropdown
        trigger="click"
        options={kinds.map((key) => ({ key, label: text(`kind.${key}`) }))}
        onSelect={(key: Kind) => add(key, parent)}
      >
        <NButton secondary type="primary">
          {text(label)}
        </NButton>
      </NDropdown>
    )
    const edit = (record: RouteConfigRecord) => {
      const kind = getKind(record)
      const meta = record.meta
      const roles = meta.role ?? []

      return (
        <div class="route-management__fields">
          {input('pagePath', record.path, (value) => (record.path = value))}
          {input(
            'literalTitle',
            String(meta.noLocalTitle ?? ''),
            (value) => (meta.noLocalTitle = value || void 0),
          )}
          {input(
            'i18nKey',
            meta.i18nKey ?? '',
            (value) => (meta.i18nKey = value || void 0),
          )}
          {input(
            'routeName',
            record.name ?? '',
            (value) => (record.name = value || void 0),
          )}
          {kind === 'page' && (
            <NFormItem
              label={text('pageView')}
              labelProps={{ id: `${id}-view` }}
            >
              <NSelect
                value={record.component}
                options={viewOptions}
                aria-labelledby={`${id}-view`}
                filterable
                onUpdateValue={(value: string) => {
                  record.component = value

                  if (meta.keepAlive) record.name = findRouteView(value)?.name
                }}
              />
            </NFormItem>
          )}
          {kind === 'redirect' &&
            input(
              'redirectTarget',
              record.redirect ?? '',
              (value) => (record.redirect = value),
            )}
          {kind === 'external' &&
            input(
              'externalUrl',
              meta.windowOpen ?? '',
              (value) => (meta.windowOpen = value),
            )}
          {input(
            'routeIcon',
            meta.icon ?? '',
            (value) => (meta.icon = value || void 0),
          )}
          <NFormItem label={text('roles')} labelProps={{ id: `${id}-roles` }}>
            <NSelect
              multiple
              filterable
              tag
              value={roles}
              options={[...new Set(['admin', ...roles])].map((value) => ({
                label: String(value),
                value,
              }))}
              aria-labelledby={`${id}-roles`}
              placeholder={text('rolesHint')}
              onUpdateValue={(value: (string | number)[]) =>
                (meta.role = value)
              }
            />
          </NFormItem>
          <NFormItem label={text('hidden')}>
            <NSwitch
              value={!!meta.hidden}
              aria-label={text('hidden')}
              onUpdateValue={(value) => (meta.hidden = value)}
            />
          </NFormItem>
          {kind === 'page' && (
            <NFormItem label={text('keepAlive')}>
              <NSwitch
                value={!!meta.keepAlive}
                aria-label={text('keepAlive')}
                onUpdateValue={(value) => {
                  meta.keepAlive = value

                  if (value && record.component)
                    record.name = findRouteView(record.component)?.name
                }}
              />
            </NFormItem>
          )}
        </div>
      )
    }

    return () => (
      <section class="route-management">
        <AppPageHeader
          eyebrow={text('eyebrow')}
          title={text('visualTitle')}
          description={text('visualDescription')}
        >
          <NTag type="info" bordered={false}>
            {t('active', { source: text(routeSourceStatus.active) })}
          </NTag>
        </AppPageHeader>
        {routeSourceStatus.error && (
          <NAlert type="warning" title={text('fallback')}>
            {routeSourceStatus.error}
          </NAlert>
        )}
        <NCard title={text('visualDraft')}>
          <p class="route-management__hint">{text('visualHint')}</p>
          <NFlex align="center">
            <NButton
              type="primary"
              onClick={apply}
              loading={saving.value}
              disabled={!hasPermission('routes:write')}
            >
              {text('apply')}
            </NButton>
            <NButton secondary onClick={validate}>
              {text('validateDraft')}
            </NButton>
            <NButton
              onClick={() => {
                const config = validate()

                if (config) downloadJson('routes.json', config)
              }}
            >
              {text('export')}
            </NButton>
            <NPopconfirm onPositiveClick={load}>
              {{
                trigger: () => <NButton>{text('resetDraft')}</NButton>,
                default: () => text('resetConfirm'),
              }}
            </NPopconfirm>
            <span role="status">{valid.value ? text('draftValid') : ''}</span>
          </NFlex>
          {error.value && (
            <NAlert
              type="error"
              title={text('invalid')}
              class="route-management__tools"
            >
              <pre class="route-management__error">{error.value}</pre>
            </NAlert>
          )}
        </NCard>
        <div class="route-management__workspace route-management__workspace--visual">
          <NCard title={text('preview')}>
            {addMenu('addRoot')}
            <NTree
              class="route-management__tree"
              blockLine
              data={tree.value.options}
              selectedKeys={selected.value === void 0 ? [] : [selected.value]}
              v-model:expandedKeys={expanded.value}
              onUpdateSelectedKeys={(keys) =>
                (selected.value = keys[0] as number | undefined)
              }
            />
          </NCard>
          <NCard title={text('editNode')}>
            {current.value ? (
              <>
                <NFlex align="center" class="route-management__node-actions">
                  <NTag bordered={false}>
                    {text(`kind.${getKind(current.value.record)}`)}
                  </NTag>
                  {current.value.record.children &&
                    addMenu('addChild', current.value.record)}
                  <NButton
                    size="small"
                    disabled={current.value.index === 0}
                    onClick={() => move(-1)}
                  >
                    {text('moveUp')}
                  </NButton>
                  <NButton
                    size="small"
                    disabled={
                      current.value.index === current.value.siblings.length - 1
                    }
                    onClick={() => move(1)}
                  >
                    {text('moveDown')}
                  </NButton>
                  <NPopconfirm onPositiveClick={remove}>
                    {{
                      trigger: () => (
                        <NButton size="small" type="error" quaternary>
                          {text('deleteNode')}
                        </NButton>
                      ),
                      default: () => text('deleteConfirm'),
                    }}
                  </NPopconfirm>
                </NFlex>
                <p class="route-management__hint">
                  <code>{current.value.path}</code>
                </p>
                {edit(current.value.record)}
              </>
            ) : (
              <p>{text('selectNode')}</p>
            )}
          </NCard>
        </div>
      </section>
    )
  },
})
