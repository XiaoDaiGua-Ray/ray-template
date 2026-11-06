import './index.scss'
import {
  deleteUsers,
  getUser,
  getUserOptions,
  getUsers,
  resetDemoUsers,
  setUserCredential,
  updateUserStatus,
} from '@/api/admin'
import { AdminApiError, apiMockEnabled } from '@/api/admin/client'
import type { AdminUser, UserOptions, UserStatus } from '@/api/admin/contracts'
import AccountPasswordForm from '@/app-components/app/AccountPasswordForm'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { RIcon, RTablePro } from '@/components'
import type { TableProInst } from '@/components'
import { useAccess, useI18n } from '@/hooks'
import {
  useSettingGetters,
  useSigningActions,
  useSigningGetters,
} from '@/store'
import type { TableProSearchFieldConfig } from '@ray-template/ui/table-pro'
import { useElementSize } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NModal,
  NResult,
  NScrollbar,
  NSpin,
  NTag,
  NTree,
} from 'naive-ui'
import type { DataTableColumns, TreeOption } from 'naive-ui'
import UserEditor from './UserEditor'

export default defineComponent({
  name: 'UserManagement',
  setup() {
    const { t } = useI18n('userManagement')
    const { t: translate } = useI18n()
    const { hasPermission } = useAccess()
    const { getSigningCallback } = useSigningGetters()
    const { restoreSession } = useSigningActions()
    const { getLocaleLanguage } = useSettingGetters()
    const table = shallowRef<TableProInst>()
    const pageElement = shallowRef<HTMLElement>()
    const { width } = useElementSize(pageElement)
    const stacked = computed(() => width.value > 0 && width.value <= 850)
    const options = shallowRef<UserOptions>()
    const optionError = ref(false)
    const optionLoading = ref(false)
    const departmentId = ref('')
    const queryParams = computed(() => ({ departmentId: departmentId.value }))
    const pagination = { pageSizes: [10, 20, 50] }
    const searchFields = computed<TableProSearchFieldConfig[]>(() => [
      { key: 'name', label: t('name'), placeholder: t('nameHint') },
      { key: 'username', label: t('username') },
      {
        type: 'select',
        key: 'status',
        label: t('status'),
        options: [
          { value: 'enabled', label: t('enabled') },
          { value: 'disabled', label: t('disabled') },
        ],
      },
    ])
    const checked = ref<(string | number)[]>([])
    const editorOpen = ref(false)
    const editing = shallowRef<AdminUser>()
    const details = shallowRef<AdminUser>()
    const credentialTarget = shallowRef<AdminUser>()
    const loadingUser = ref('')
    const busy = ref(false)
    const abort = new AbortController()

    onScopeDispose(() => abort.abort())
    const errorText = (error: unknown) =>
      t(
        `errors.${error instanceof AdminApiError ? error.key : 'requestFailed'}`,
      )
    const loadOptions = async () => {
      optionLoading.value = true
      optionError.value = false

      try {
        options.value = await getUserOptions(abort.signal)
      } catch {
        if (!abort.signal.aborted) optionError.value = true
      } finally {
        optionLoading.value = false
      }
    }

    void loadOptions()

    const departmentLabel = (id: string) => {
      const department = options.value?.departments.find(
        (item) => item.id === id,
      )

      return department?.labelKey
        ? translate(department.labelKey)
        : (department?.name ?? (id || t('allUsers')))
    }
    const roleLabel = (value: string) => {
      const role = options.value?.roles.find((item) => item.value === value)

      return role?.labelKey ? translate(role.labelKey) : (role?.label ?? value)
    }
    const tree = computed(() => {
      const visit = (parentId: string | null): TreeOption[] =>
        (options.value?.departments ?? [])
          .filter((item) => item.parentId === parentId)
          .map((item) => ({
            key: item.id,
            label: departmentLabel(item.id),
            children: visit(item.id),
          }))

      return [{ key: '', label: t('allUsers'), children: visit(null) }]
    })
    const roleEditable = (user: AdminUser) =>
      !!options.value?.roles.some(
        (role) => role.value === user.role && !role.disabled,
      )
    const editable = (user: AdminUser) =>
      hasPermission('users:update') && roleEditable(user)
    const removable = (user: AdminUser) =>
      hasPermission('users:delete') &&
      roleEditable(user) &&
      user.id !== getSigningCallback.value.id
    const canSetCredential = (user: AdminUser) =>
      hasPermission('users:credentials') &&
      roleEditable(user) &&
      user.id !== getSigningCallback.value.id
    const saveCredential = async (password: string) => {
      const target = credentialTarget.value

      if (!target) return

      await setUserCredential(target.id, password)
      credentialTarget.value = void 0
      window.$message.success(translate('account.credentialSaved'))
    }
    const reload = async () => {
      checked.value = []
      await table.value?.reload(true)
    }
    const mutate = async (action: () => Promise<unknown>) => {
      if (busy.value) return false

      busy.value = true

      try {
        await action()
        await reload()
        window.$message.success(t('updated'))

        return true
      } catch (error) {
        window.$message.error(errorText(error))

        return false
      } finally {
        busy.value = false
      }
    }
    const confirmDelete = (ids: string[], name?: string) =>
      window.$dialog.warning({
        title: t('confirmDelete'),
        content: name
          ? t('deleteOne', { name })
          : t('deleteMany', { count: ids.length }),
        positiveText: t('delete'),
        negativeText: t('cancel'),
        onPositiveClick: () => mutate(() => deleteUsers(ids)),
      })
    const changeStatus = (ids: string[], status: UserStatus) =>
      window.$dialog.warning({
        title: t(status === 'enabled' ? 'confirmEnable' : 'confirmDisable'),
        content: t('changeMany', { count: ids.length }),
        positiveText: t(status === 'enabled' ? 'enable' : 'disable'),
        negativeText: t('cancel'),
        onPositiveClick: () => mutate(() => updateUserStatus(ids, status)),
      })
    const openUser = async (id: string, edit = false) => {
      if (loadingUser.value) return

      loadingUser.value = id

      try {
        const user = await getUser(id, abort.signal)

        if (abort.signal.aborted) return

        if (edit) {
          editing.value = user
          editorOpen.value = true
        } else details.value = user
      } catch (error) {
        window.$message.error(errorText(error))
      } finally {
        loadingUser.value = ''
      }
    }
    const columns = computed<DataTableColumns<AdminUser>>(() => {
      const result: DataTableColumns<AdminUser> = [
        {
          type: 'selection',
          width: 44,
          disabled: (row) =>
            row.id === getSigningCallback.value.id || !roleEditable(row),
        },
        {
          title: t('name'),
          key: 'name',
          minWidth: 155,
          render: (row) => (
            <div class="user-management__identity">
              <strong>{row.name}</strong>
              <span>{row.username}</span>
            </div>
          ),
        },
        {
          title: t('email'),
          key: 'email',
          minWidth: 210,
          ellipsis: { tooltip: true },
        },
        {
          title: t('department'),
          key: 'departmentId',
          width: 130,
          render: (row) => departmentLabel(row.departmentId),
        },
        {
          title: t('role'),
          key: 'role',
          width: 110,
          render: (row) => roleLabel(row.role),
        },
        {
          title: t('status'),
          key: 'status',
          width: 90,
          render: (row) => (
            <NTag
              size="small"
              bordered={false}
              type={row.status === 'enabled' ? 'success' : 'default'}
            >
              {t(row.status)}
            </NTag>
          ),
        },
        {
          title: t('actions'),
          key: 'actions',
          fixed: stacked.value ? void 0 : 'right',
          width: hasPermission('users:credentials') ? 300 : 240,
          allowExport: false,
          render: (row) => (
            <NFlex size="small" wrap={false}>
              <NButton
                text
                size="small"
                aria-label={t('viewNamed', { name: row.name })}
                loading={loadingUser.value === row.id}
                onClick={() => void openUser(row.id)}
              >
                {t('view')}
              </NButton>
              {editable(row) && (
                <NButton
                  text
                  type="primary"
                  size="small"
                  aria-label={t('editNamed', { name: row.name })}
                  disabled={!!loadingUser.value || busy.value}
                  onClick={() => void openUser(row.id, true)}
                >
                  {t('edit')}
                </NButton>
              )}
              {hasPermission('users:status') &&
                row.id !== getSigningCallback.value.id &&
                roleEditable(row) && (
                  <NButton
                    text
                    size="small"
                    disabled={busy.value}
                    aria-label={t(
                      row.status === 'enabled' ? 'disableNamed' : 'enableNamed',
                      { name: row.name },
                    )}
                    onClick={() =>
                      changeStatus(
                        [row.id],
                        row.status === 'enabled' ? 'disabled' : 'enabled',
                      )
                    }
                  >
                    {t(row.status === 'enabled' ? 'disable' : 'enable')}
                  </NButton>
                )}
              {canSetCredential(row) && (
                <NButton
                  text
                  size="small"
                  aria-label={translate('account.setPasswordFor', {
                    name: row.name,
                  })}
                  onClick={() => (credentialTarget.value = row)}
                >
                  {translate('account.setPassword')}
                </NButton>
              )}
              {removable(row) && (
                <NButton
                  text
                  type="error"
                  size="small"
                  aria-label={t('deleteNamed', { name: row.name })}
                  disabled={busy.value}
                  onClick={() => confirmDelete([row.id], row.name)}
                >
                  {t('delete')}
                </NButton>
              )}
            </NFlex>
          ),
        },
      ]

      return hasPermission(['users:delete', 'users:status'], 'any')
        ? result
        : result.filter((column) => column.type !== 'selection')
    })
    const closeEditor = () => {
      editorOpen.value = false
      editing.value = void 0
    }
    const saved = async (user: AdminUser) => {
      const created = !editing.value

      closeEditor()
      window.$message.success(
        created ? translate('account.userCreated') : t('saved'),
      )

      if (user.id === getSigningCallback.value.id) await restoreSession()

      await reload()
    }
    const reset = () =>
      window.$dialog.warning({
        title: t('reset'),
        content: t('resetConfirm'),
        positiveText: t('reset'),
        negativeText: t('cancel'),
        onPositiveClick: () =>
          mutate(async () => {
            await resetDemoUsers()
            departmentId.value = ''
            await table.value?.resetSearch()
          }),
      })

    return () => (
      <section
        ref={pageElement}
        class={[
          'user-management',
          { 'user-management--stacked': stacked.value },
        ]}
      >
        <AppPageHeader
          eyebrow="WORKSPACE / USERS"
          title={t('title')}
          description={t(
            apiMockEnabled ? 'descriptionMock' : 'descriptionServer',
          )}
        >
          {hasPermission('users:create') && (
            <NButton
              type="primary"
              onClick={() => {
                editing.value = void 0
                editorOpen.value = true
              }}
            >
              <RIcon name="action/add" /> {t('createUser')}
            </NButton>
          )}
          {apiMockEnabled && hasPermission('users:reset') && (
            <NButton secondary disabled={busy.value} onClick={reset}>
              {t('reset')}
            </NButton>
          )}
          <NButton
            tag="a"
            {...{
              href: `${import.meta.env.BASE_URL}contracts/admin-api.json`,
              target: '_blank',
              rel: 'noreferrer',
            }}
            secondary
          >
            {t('apiContract')}
          </NButton>
        </AppPageHeader>
        <NSpin show={optionLoading.value}>
          {optionError.value ? (
            <NResult status="error" title={t('optionsFailed')}>
              <NButton onClick={() => void loadOptions()}>{t('retry')}</NButton>
            </NResult>
          ) : (
            options.value && (
              <div class="user-management__layout">
                <NCard
                  title={t('organization')}
                  class="user-management__organization"
                  size={stacked.value ? 'small' : 'medium'}
                  contentScrollable
                  contentStyle={{ paddingInline: '12px', paddingBlock: '8px' }}
                >
                  <NTree
                    data={tree.value}
                    blockLine
                    indent={12}
                    defaultExpandedKeys={[
                      '',
                      ...options.value.departments
                        .filter((item) =>
                          options.value!.departments.some(
                            (child) => child.parentId === item.id,
                          ),
                        )
                        .map((item) => item.id),
                    ]}
                    selectedKeys={[departmentId.value]}
                    onUpdateSelectedKeys={(keys) => {
                      departmentId.value = String(keys[0] ?? '')
                      checked.value = []
                    }}
                  />
                </NCard>
                <NScrollbar
                  class="user-management__list-viewport"
                  contentClass="user-management__list"
                >
                  {checked.value.length > 0 && (
                    <div class="user-management__selection" role="status">
                      <span>
                        {t('selected', { count: checked.value.length })}
                      </span>
                      <NButton
                        text
                        onClick={() => {
                          checked.value = []
                        }}
                      >
                        {t('clearSelection')}
                      </NButton>
                      {hasPermission('users:status') && (
                        <>
                          <NButton
                            size="small"
                            disabled={busy.value}
                            onClick={() =>
                              changeStatus(checked.value.map(String), 'enabled')
                            }
                          >
                            {t('batchEnable')}
                          </NButton>
                          <NButton
                            size="small"
                            disabled={busy.value}
                            onClick={() =>
                              changeStatus(
                                checked.value.map(String),
                                'disabled',
                              )
                            }
                          >
                            {t('batchDisable')}
                          </NButton>
                        </>
                      )}
                      {hasPermission('users:delete') && (
                        <NButton
                          size="small"
                          type="error"
                          secondary
                          disabled={busy.value}
                          onClick={() =>
                            confirmDelete(checked.value.map(String))
                          }
                        >
                          {t('batchDelete')}
                        </NButton>
                      )}
                    </div>
                  )}
                  <RTablePro
                    autoHeight={!stacked.value}
                    ref={table}
                    title={departmentLabel(departmentId.value)}
                    request={getUsers}
                    params={queryParams.value}
                    columns={columns.value}
                    v-model:checkedRowKeys={checked.value}
                    columnStateKey="system:users"
                    scrollX={1060}
                    pageSize={10}
                    pagination={pagination}
                    search={searchFields.value}
                    onSearch={() => {
                      checked.value = []
                    }}
                    onUpdatePage={() => {
                      checked.value = []
                    }}
                    onUpdatePageSize={() => {
                      checked.value = []
                    }}
                    downloadCsvTableOptions={{ fileName: 'users' }}
                    getCsvCell={(value, _row, column) =>
                      column.key === 'departmentId'
                        ? departmentLabel(String(value))
                        : column.key === 'role'
                          ? roleLabel(String(value))
                          : column.key === 'status'
                            ? t(String(value))
                            : String(value ?? '')
                    }
                  />
                </NScrollbar>
              </div>
            )
          )}
        </NSpin>
        {editorOpen.value && options.value && (
          <UserEditor
            user={editing.value}
            options={options.value}
            departmentId={departmentId.value || void 0}
            currentUserId={getSigningCallback.value.id}
            onClose={closeEditor}
            onSaved={(user) => void saved(user)}
          />
        )}
        <NModal
          show={!!credentialTarget.value}
          onUpdateShow={(show) => {
            if (!show) credentialTarget.value = void 0
          }}
          preset="card"
          class="user-management__modal user-management__modal--details"
          title={translate('account.setPasswordFor', {
            name: credentialTarget.value?.name ?? '',
          })}
          aria-label={translate('account.setPassword')}
          maskClosable={false}
        >
          {credentialTarget.value && (
            <NFlex vertical>
              <p>
                {translate(
                  apiMockEnabled
                    ? 'account.demoPasswordNotice'
                    : 'account.credentialNotice',
                )}
              </p>
              <AccountPasswordForm
                username={credentialTarget.value.username}
                save={saveCredential}
              />
            </NFlex>
          )}
        </NModal>
        <NModal
          show={!!details.value}
          onUpdateShow={(show) => {
            if (!show) details.value = void 0
          }}
          preset="card"
          class="user-management__modal user-management__modal--details"
          title={t('details')}
          aria-label={t('details')}
        >
          {details.value && (
            <NDescriptions column={1} labelPlacement="left" bordered>
              {(
                [
                  'username',
                  'name',
                  'email',
                  'phone',
                  'departmentId',
                  'role',
                  'status',
                  'createdAt',
                  'remark',
                ] as const
              ).map((key) => (
                <NDescriptionsItem
                  key={key}
                  label={t(key === 'departmentId' ? 'department' : key)}
                >
                  {key === 'departmentId'
                    ? departmentLabel(details.value!.departmentId)
                    : key === 'role'
                      ? roleLabel(details.value!.role)
                      : key === 'status'
                        ? t(details.value!.status)
                        : key === 'createdAt'
                          ? new Intl.DateTimeFormat(getLocaleLanguage.value, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }).format(new Date(details.value!.createdAt))
                          : details.value![key] || '—'}
                </NDescriptionsItem>
              ))}
            </NDescriptions>
          )}
        </NModal>
      </section>
    )
  },
})
