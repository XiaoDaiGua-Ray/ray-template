import './search.scss'
import { useSettingGetters } from '@/store'
import { RTablePro, useTablePro } from '@ray-template/ui/table-pro'
import type {
  TableProColumn,
  TableProParams,
  TableProRequest,
  TableProSearchOptionContext,
  TableProSearchOptions,
  TableProSearchValues,
} from '@ray-template/ui/table-pro'
import {
  NButton,
  NCard,
  NCheckbox,
  NFlex,
  NRadio,
  NRadioGroup,
  NTag,
} from 'naive-ui'
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  shallowRef,
  useId,
} from 'vue'
import DemoPage from '../components/DemoPage'
import { searchCopy } from './search-copy'
import {
  orderMatchesQuery,
  orders,
  organizations,
  owners,
  products,
  statuses,
  waitForDemo,
  warehouses,
} from './search-fixtures'

const initialValues: TableProSearchValues = { status: ['pending'] }
const pagination = { pageSizes: [5, 10, 20] }
const instantDelay = 350
const extraKeys = [
  'productId',
  'warehouseId',
  'minAmount',
  'invoiced',
  'delivery',
  'deliveryAt',
  'deliveryTime',
] as const

type Trace = {
  id: number
  kind: 'list' | 'owner'
  detail: number | string
  phase: 'pending' | 'success' | 'cancelled' | 'failed'
}

const traceTypes = {
  pending: 'info',
  success: 'success',
  cancelled: 'default',
  failed: 'error',
} as const

const scenarios = ['combine', 'race', 'deliveryRecipe', 'validation'] as const

type Scenario = (typeof scenarios)[number]

function nonemptyValues(values: TableProSearchValues) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) =>
        value != null &&
        value !== '' &&
        (!Array.isArray(value) || value.length > 0),
    ),
  )
}

export default defineComponent({
  name: 'TableDemoSearch',
  setup() {
    const { getLocaleLanguage } = useSettingGetters()
    const copy = computed(() =>
      getLocaleLanguage.value === 'zh-CN' ? searchCopy.zh : searchCopy.en,
    )
    const id = useId()
    const [register, table] = useTablePro()
    const source = ref<'local' | 'remote'>('local')
    const submitMode = ref<'manual' | 'change'>('manual')
    const more = ref(false)
    const scenario = ref<Scenario>()
    const listPayload = shallowRef<TableProParams>({})
    const mapped = shallowRef<Readonly<Record<string, unknown>>>(initialValues)
    const trace = shallowRef<readonly Trace[]>([])
    let requestId = 0
    let failListOnce = false
    let failOwnerOnce = false

    const track = async <T,>(
      kind: Trace['kind'],
      detail: Trace['detail'],
      delay: number,
      signal: AbortSignal,
      result: () => T,
    ) => {
      const id = ++requestId
      const entry: Trace = { id, kind, detail, phase: 'pending' }

      trace.value = [entry, ...trace.value].slice(0, 6)
      const finish = (phase: Trace['phase']) => {
        trace.value = trace.value.map((entry) =>
          entry.id === id ? { ...entry, phase } : entry,
        )
      }

      try {
        await waitForDemo(delay, signal)
        const value = result()

        finish('success')

        return value
      } catch (error) {
        finish(signal.aborted ? 'cancelled' : 'failed')
        throw error
      }
    }

    const rows = computed(() =>
      orders.map((row) => ({
        ...row,
        product: copy.value.products[row.productIndex],
        statusLabel: copy.value.statuses[row.statusIndex],
        organization: copy.value.teams[row.orgId === 'north' ? 0 : 1],
        owner: copy.value.people[row.ownerIndex],
      })),
    )
    const money = computed(
      () =>
        new Intl.NumberFormat(getLocaleLanguage.value, {
          style: 'currency',
          currency: copy.value.currency,
          maximumFractionDigits: 0,
        }),
    )
    const dateTime = computed(
      () =>
        new Intl.DateTimeFormat(getLocaleLanguage.value, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
    )
    const deliveryDetails: TableProColumn = {
      type: 'expand',
      renderExpand: (row: (typeof orders)[number]) => {
        const labels = copy.value
        const details = [
          [labels.warehouse, labels.warehouseLabels[row.warehouseIndex]],
          [labels.invoiced, row.invoiced ? labels.yes : labels.no],
          [
            labels.delivery,
            row.delivery === 'express' ? labels.express : labels.standard,
          ],
          [labels.deliveryAt, dateTime.value.format(row.deliveryAt)],
        ]

        return (
          <dl class="r-search-demo__order">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )
      },
    }
    const columns = computed<TableProColumn[]>(() => [
      ...(more.value ? [deliveryDetails] : []),
      { key: 'orderNo', title: copy.value.order, minWidth: 92 },
      { key: 'product', title: copy.value.product, minWidth: 90 },
      { key: 'statusLabel', title: copy.value.status, minWidth: 82 },
      { key: 'createdAt', title: copy.value.created, minWidth: 108 },
      { key: 'organization', title: copy.value.organization, minWidth: 90 },
      { key: 'owner', title: copy.value.owner, minWidth: 90 },
      {
        key: 'amount',
        title: copy.value.amount,
        minWidth: 85,
        render: (row: Record<string, unknown>) =>
          money.value.format(Number(row.amount)),
      },
    ])

    const draft = computed(() =>
      table.isReady.value ? nonemptyValues(table.getSearchValues()) : {},
    )
    const applied = computed(() =>
      table.isReady.value ? table.getSearchValues('applied') : initialValues,
    )
    const dirty = computed(
      () => JSON.stringify(draft.value) !== JSON.stringify(applied.value),
    )
    const pageRows = computed(() =>
      table.isReady.value ? table.getCurrentPageData().length : 0,
    )
    const showExtra = () => more.value

    const fillDraft = (values: TableProSearchValues) => {
      table.setSearchValues({
        ...Object.fromEntries(
          Object.keys(table.getSearchValues()).map((key) => [key, null]),
        ),
        ...values,
      })
    }

    const loadOwners = ({
      keyword,
      values,
      signal,
    }: TableProSearchOptionContext) => {
      const org = values.orgId === 'north' ? 'north' : 'south'
      const fail = failOwnerOnce

      failOwnerOnce = false

      return track('owner', org, org === 'north' ? 800 : 450, signal, () => {
        if (fail) throw new Error('Simulated assignee request failure')

        return owners.flatMap(({ id, orgId }, index) => {
          const label = copy.value.people[index]

          return orgId === org &&
            label.toLowerCase().includes(keyword.trim().toLowerCase())
            ? [{ label, value: id }]
            : []
        })
      })
    }

    const search = computed<TableProSearchOptions>(() => {
      const labels = copy.value

      return {
        initialValues,
        submitMode: submitMode.value,
        debounce: instantDelay,
        searchText: labels.apply,
        resetText: labels.reset,
        renderActions: ({ defaultActions, submit }) => (
          <>
            <NButton
              text
              attrType="button"
              onClick={() => {
                fillDraft({})
                void submit()
              }}
            >
              {labels.clear}
            </NButton>
            {defaultActions}
          </>
        ),
        fields: [
          {
            key: 'keyword',
            label: labels.keyword,
            type: 'text',
            placeholder: labels.keywordHint,
            getValue: (row) => `${row.orderNo} ${row.product}`,
            rules: {
              trigger: 'blur',
              validator: (_rule, value: unknown) =>
                typeof value !== 'string' ||
                value.trim().length === 0 ||
                value.trim().length >= 2 ||
                new Error(labels.keywordError),
            },
          },
          {
            key: 'status',
            label: labels.status,
            type: 'select',
            multiple: true,
            options: statuses.map((value, index) => ({
              value,
              label: labels.statuses[index],
            })),
          },
          {
            key: 'createdAt',
            label: labels.created,
            type: 'dateRange',
            span: 2,
            transform: ([createdFrom, createdTo]) => ({
              createdFrom,
              createdTo,
            }),
          },
          {
            key: 'orgId',
            label: labels.organization,
            type: 'select',
            options: organizations.map((value, index) => ({
              value,
              label: labels.teams[index],
            })),
          },
          {
            key: 'ownerId',
            label: labels.owner,
            type: 'select',
            dependsOn: ['orgId'],
            visible: ({ orgId }) => orgId != null,
            loadOptions: loadOwners,
          },
          {
            key: 'productId',
            label: labels.category,
            type: 'cascader',
            visible: showExtra,
            fieldProps: {
              options: labels.groups.map((label, group) => ({
                label,
                value: `category-${group}`,
                children: products
                  .slice(group * 2, group * 2 + 2)
                  .map((value, index) => ({
                    value,
                    label: labels.products[group * 2 + index],
                  })),
              })),
            },
          },
          {
            key: 'warehouseId',
            label: labels.warehouse,
            type: 'treeSelect',
            visible: showExtra,
            fieldProps: {
              defaultExpandAll: true,
              options: labels.teams.map((label, region) => ({
                label,
                key: `region-${region}`,
                disabled: true,
                children: warehouses
                  .slice(region * 2, region * 2 + 2)
                  .map((key, index) => ({
                    key,
                    label: labels.warehouseLabels[region * 2 + index],
                  })),
              })),
            },
          },
          {
            key: 'minAmount',
            label: labels.minAmount,
            type: 'number',
            visible: showExtra,
            fieldProps: { min: 0, step: 50 },
            getValue: (row) => row.amount,
            matches: (cell, minimum) =>
              typeof cell === 'number' && cell >= minimum,
          },
          {
            key: 'invoiced',
            label: labels.invoiced,
            type: 'boolean',
            visible: showExtra,
          },
          {
            key: 'delivery',
            label: labels.delivery,
            type: 'custom',
            visible: showExtra,
            render: ({ inputId, labelId, value, setValue }) => (
              <NRadioGroup
                name={inputId}
                aria-labelledby={labelId}
                value={typeof value === 'string' ? value : 'any'}
                onUpdateValue={(next) => setValue(next === 'any' ? null : next)}
              >
                <NFlex size="small">
                  <NRadio value="any">{labels.any}</NRadio>
                  <NRadio value="standard">{labels.standard}</NRadio>
                  <NRadio value="express">{labels.express}</NRadio>
                </NFlex>
              </NRadioGroup>
            ),
          },
          {
            key: 'deliveryAt',
            label: labels.deliveryAt,
            type: 'datetimeRange',
            span: 2,
            visible: showExtra,
            transform: ([deliveryFrom, deliveryTo]) => ({
              deliveryFrom,
              deliveryTo,
            }),
          },
          {
            key: 'deliveryTime',
            label: labels.deliveryTime,
            type: 'time',
            visible: showExtra,
          },
        ],
      }
    })

    const request: TableProRequest = (query, signal) => {
      const { page = 1, pageSize = 5 } = query
      const fail = failListOnce

      listPayload.value = query
      failListOnce = false

      return track('list', page, 400, signal, () => {
        if (fail) throw new Error('Simulated list request failure')

        const matched = rows.value.filter((row) =>
          orderMatchesQuery(row, query),
        )
        const start = (page - 1) * pageSize

        return {
          data: matched.slice(start, start + pageSize),
          total: matched.length,
        }
      })
    }

    const startScenario = async (next: Scenario) => {
      scenario.value = next
      more.value = next === 'deliveryRecipe'

      switch (next) {
        case 'combine':
          fillDraft({
            status: ['pending', 'paid'],
            createdAt: ['2026-11-01', '2026-11-08'],
          })
          break
        case 'race':
          fillDraft({})
          await nextTick()
          table.setSearchValues({ orgId: 'north', ownerId: 'n1' })
          await nextTick()
          table.setSearchValues({ orgId: 'south' })
          break
        case 'deliveryRecipe':
          fillDraft({
            productId: 'notebook',
            warehouseId: 'north-main',
            minAmount: 0,
            invoiced: false,
            delivery: 'express',
            deliveryAt: [
              new Date(2026, 10, 2).getTime(),
              new Date(2026, 10, 10, 23, 59).getTime(),
            ],
            deliveryTime: '09:00:00',
          })
          break
        default:
          fillDraft({ keyword: 'O' })
          await table.submitSearch()
          break
      }
    }

    const failList = () => {
      failListOnce = true
      void table.reload()
    }
    const failOwner = () => {
      failOwnerOnce = true
      table.setSearchValues({
        orgId: draft.value.orgId === 'north' ? 'south' : 'north',
      })
    }

    const scenarioHint = computed(
      () =>
        ({
          combine: copy.value.combineHint,
          race: copy.value.raceHint,
          deliveryRecipe: copy.value.deliveryHint,
          validation: copy.value.validationHint,
        })[scenario.value ?? 'combine'],
    )

    return () => {
      const labels = copy.value
      const query = table.queryState.value
      const output =
        source.value === 'remote'
          ? ([labels.payload, listPayload.value] as const)
          : ([labels.mapped, mapped.value] as const)

      return (
        <DemoPage title={labels.title} description={labels.description}>
          <NCard size="small">
            <div class="r-search-demo__guide">
              <strong>{labels.tryScenario}</strong>
              <NFlex size="small">
                {scenarios.map((key) => (
                  <NButton
                    key={key}
                    size="small"
                    secondary
                    type={scenario.value === key ? 'primary' : 'default'}
                    disabled={!table.isReady.value}
                    onClick={() => void startScenario(key)}
                  >
                    {labels[key]}
                  </NButton>
                ))}
              </NFlex>
              {scenario.value && <p role="status">{scenarioHint.value}</p>}
              <div class="r-search-demo__settings">
                <NRadioGroup
                  name={`${id}-source`}
                  aria-label={labels.source}
                  value={source.value}
                  onUpdateValue={(value) => {
                    source.value = value === 'remote' ? 'remote' : 'local'
                  }}
                >
                  <NFlex size="small">
                    <NRadio value="local">{labels.local}</NRadio>
                    <NRadio value="remote">{labels.remote}</NRadio>
                  </NFlex>
                </NRadioGroup>
                <NRadioGroup
                  name={`${id}-mode`}
                  aria-label={labels.submitMode}
                  value={submitMode.value}
                  onUpdateValue={(value) => {
                    submitMode.value = value === 'change' ? 'change' : 'manual'
                  }}
                >
                  <NFlex size="small">
                    <NRadio value="manual">{labels.manual}</NRadio>
                    <NRadio value="change">{labels.instant}</NRadio>
                  </NFlex>
                </NRadioGroup>
              </div>
              <p>
                {submitMode.value === 'manual'
                  ? labels.manualHint
                  : labels.instantHint}
              </p>
              <NCheckbox
                checked={more.value}
                onUpdateChecked={(checked) => {
                  more.value = checked

                  if (!checked)
                    table.setSearchValues(
                      Object.fromEntries(extraKeys.map((key) => [key, null])),
                    )
                }}
              >
                {labels.more}
              </NCheckbox>
            </div>
          </NCard>

          <RTablePro
            onRegister={register}
            columns={columns.value}
            search={search.value}
            data={source.value === 'local' ? rows.value : void 0}
            request={source.value === 'remote' ? request : void 0}
            pageSize={5}
            pagination={pagination}
            scrollX={more.value ? 700 : 645}
            tool={false}
            onSearch={({ params }) => {
              mapped.value = params
            }}
          />

          <div role="status">
            <NFlex size="small" align="center">
              <NTag size="small" type={dirty.value ? 'warning' : 'success'}>
                {dirty.value ? labels.dirty : labels.clean}
              </NTag>
              <NTag size="small">{labels.pageRows(pageRows.value)}</NTag>
              {query?.total != null && (
                <NTag size="small">{labels.matchedRows(query.total)}</NTag>
              )}
            </NFlex>
          </div>

          <details class="r-search-demo__details" open>
            <summary>{labels.inspector}</summary>
            <div class="r-search-demo__values">
              {(
                [
                  [labels.draft, draft.value],
                  [labels.applied, applied.value],
                  output,
                ] as const
              ).map(([label, values]) => (
                <div class="r-demo-result" key={label}>
                  <span class="r-demo-result__label">{label}</span>
                  <div class="r-demo-result__value">
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <NCard size="small">
            <div class="r-search-demo__trace-head">
              <strong>{labels.trace}</strong>
              <NFlex size="small">
                <NButton
                  size="small"
                  secondary
                  disabled={!table.isReady.value}
                  onClick={failOwner}
                >
                  {labels.failOwner}
                </NButton>
                {source.value === 'remote' && (
                  <NButton
                    size="small"
                    secondary
                    disabled={!table.isReady.value || query?.loading}
                    onClick={failList}
                  >
                    {labels.failList}
                  </NButton>
                )}
              </NFlex>
            </div>
            {trace.value.length ? (
              <ol class="r-search-demo__trace" aria-label={labels.trace}>
                {trace.value.map(({ id, kind, detail, phase }) => (
                  <li key={id}>
                    <span>
                      {kind === 'list'
                        ? labels.listRequest
                        : labels.ownerRequest}
                    </span>
                    <span>
                      {typeof detail === 'number'
                        ? labels.page(detail)
                        : labels.teams[detail === 'north' ? 0 : 1]}
                    </span>
                    <NTag size="small" type={traceTypes[phase]}>
                      {labels.phases[phase]}
                    </NTag>
                  </li>
                ))}
              </ol>
            ) : (
              <p class="r-search-demo__empty">{labels.emptyTrace}</p>
            )}
          </NCard>
        </DemoPage>
      )
    }
  },
})
