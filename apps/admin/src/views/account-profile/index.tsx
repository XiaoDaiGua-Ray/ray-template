import './index.scss'
import {
  changeAccountPassword,
  getAccountProfile,
  updateAccountProfile,
} from '@/api/admin'
import { apiMockEnabled } from '@/api/admin/client'
import { profileInputSchema } from '@/api/admin/contracts'
import type { AccountProfile } from '@/api/admin/contracts'
import AccountPasswordForm from '@/app-components/app/AccountPasswordForm'
import AccountAvatar from '@/app-components/app/AppAvatar/AccountAvatar'
import AppPageHeader from '@/app-components/app/AppPageHeader'
import { useI18n } from '@/hooks'
import { useSigningActions, useSigningGetters } from '@/store'
import { RIcon } from '@ray-template/ui/icon'
import {
  NAlert,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSpin,
  NTag,
} from 'naive-ui'
import * as v from 'valibot'

const accountSections = [
  {
    key: 'profile',
    icon: 'action/edit',
    title: 'editProfile',
    hint: 'profileNavHint',
  },
  {
    key: 'security',
    icon: 'action/lock',
    title: 'securitySection',
    hint: 'securityNavHint',
  },
] as const

type AccountSection = (typeof accountSections)[number]['key']

const readonlyInputTheme = {
  color: 'var(--r-surface-muted)',
  colorFocus: 'var(--r-surface-muted)',
}

export default defineComponent({
  name: 'AccountProfile',
  setup() {
    const { t } = useI18n('account')
    const { t: translate, te } = useI18n()
    const { updateDisplayName, endSession } = useSigningActions()
    const { getSigningCallback } = useSigningGetters()
    const profile = shallowRef<AccountProfile>()
    const form = reactive({ name: '', phone: '' })
    const loading = ref(false)
    const saving = ref(false)
    const loadError = ref(false)
    const formError = ref('')
    const activeSection = ref<AccountSection>('profile')
    const nameId = useId()
    const phoneId = useId()
    const usernameId = useId()
    const emailId = useId()
    const navigationId = useId()
    const request = new AbortController()

    const tabId = (section: AccountSection) => `${navigationId}-tab-${section}`
    const panelId = (section: AccountSection) =>
      `${navigationId}-panel-${section}`

    const moveSection = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      const current = accountSections.findIndex(
        ({ key }) => key === activeSection.value,
      )
      const count = accountSections.length
      let next: number

      switch (event.key) {
        case 'ArrowDown':
          next = (current + 1) % count
          break
        case 'ArrowUp':
          next = (current + count - 1) % count
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = count - 1
          break
        default:
          return
      }

      event.preventDefault()
      const section = accountSections[next].key

      activeSection.value = section
      const list = event.currentTarget as HTMLElement

      list
        .querySelector<HTMLButtonElement>(`[data-section="${section}"]`)
        ?.focus()
    }

    const setProfile = (value: AccountProfile) => {
      profile.value = value
      form.name = value.name
      form.phone = value.phone
    }

    const load = async () => {
      loading.value = true
      loadError.value = false

      try {
        setProfile(await getAccountProfile(request.signal))
      } catch {
        if (!request.signal.aborted) loadError.value = true
      } finally {
        loading.value = false
      }
    }

    const saveProfile = async (event: Event) => {
      event.preventDefault()

      if (saving.value) return

      const result = v.safeParse(profileInputSchema, form)

      if (!result.success) {
        formError.value = t('invalidProfile')

        return
      }

      formError.value = ''
      saving.value = true

      try {
        const updated = await updateAccountProfile(result.output)

        setProfile(updated)
        updateDisplayName(updated.name)
        window.$message.success(t('profileSaved'))
      } catch {
        formError.value = t('saveFailed')
      } finally {
        saving.value = false
      }
    }
    const savePassword = async (
      newPassword: string,
      currentPassword: string,
    ) => {
      await changeAccountPassword({ currentPassword, newPassword })
      window.$message.success(t('passwordChanged'))
      await endSession()
    }

    onMounted(load)
    onBeforeUnmount(() => request.abort())

    return () => {
      const account = profile.value
      const roleKey = account && `userManagement.roles.${account.role}`

      return (
        <section class="r-account-profile" aria-busy={loading.value}>
          <AppPageHeader
            eyebrow={t('eyebrow')}
            title={t('profile')}
            description={t('description')}
          />
          {loading.value && (
            <div class="r-account-profile__loading">
              <NSpin show />
            </div>
          )}
          {loadError.value && (
            <NAlert type="error" title={t('loadFailed')}>
              <NButton size="small" onClick={load}>
                {t('retry')}
              </NButton>
            </NAlert>
          )}
          {account && (
            <>
              <section
                class="r-account-profile__summary"
                aria-label={t('details')}
              >
                <div class="r-account-profile__summary-body">
                  <div class="r-account-profile__identity">
                    <AccountAvatar
                      class="r-account-profile__avatar"
                      name={account.name}
                      src={account.avatar || getSigningCallback.value.avatar}
                      size={64}
                      objectFit="cover"
                    />
                    <div class="r-account-profile__identity-copy">
                      <h2>{account.name}</h2>
                      <p class="r-account-profile__handle">
                        @{account.username}
                      </p>
                    </div>
                  </div>
                  <dl class="r-account-profile__facts">
                    <div>
                      <dt>{t('department')}</dt>
                      <dd>
                        {account.department.labelKey
                          ? translate(account.department.labelKey)
                          : account.department.name}
                      </dd>
                    </div>
                    <div>
                      <dt>{t('role')}</dt>
                      <dd>
                        <NTag type="primary" size="small" bordered={false}>
                          {roleKey && te?.(roleKey)
                            ? translate(roleKey)
                            : account.role}
                        </NTag>
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>
              <div class="r-account-profile__workspace">
                <div
                  class="r-account-profile__navigation"
                  role="tablist"
                  aria-label={t('eyebrow')}
                  aria-orientation="vertical"
                  onKeydown={moveSection}
                >
                  {accountSections.map(({ key, icon, title, hint }) => {
                    const id = tabId(key)
                    const selected = activeSection.value === key

                    return (
                      <button
                        key={key}
                        id={id}
                        data-section={key}
                        type="button"
                        role="tab"
                        class="r-account-profile__section"
                        aria-selected={selected}
                        aria-controls={panelId(key)}
                        aria-labelledby={`${id}-label`}
                        aria-describedby={`${id}-hint`}
                        tabindex={selected ? 0 : -1}
                        onClick={() => (activeSection.value = key)}
                      >
                        <span
                          class="r-account-profile__section-icon"
                          aria-hidden="true"
                        >
                          <RIcon name={icon} size={19} />
                        </span>
                        <span class="r-account-profile__section-copy">
                          <span
                            id={`${id}-label`}
                            class="r-account-profile__section-label"
                          >
                            {t(title)}
                          </span>
                          <span
                            id={`${id}-hint`}
                            class="r-account-profile__section-hint"
                          >
                            {t(hint)}
                          </span>
                        </span>
                        <span
                          class="r-account-profile__section-indicator"
                          aria-hidden="true"
                        >
                          <RIcon name="directional/right_arrow" size={14} />
                        </span>
                      </button>
                    )
                  })}
                </div>
                <section
                  id={panelId('profile')}
                  class="r-account-profile__panel"
                  role="tabpanel"
                  aria-labelledby={tabId('profile')}
                  hidden={activeSection.value !== 'profile'}
                  tabindex={0}
                >
                  <header class="r-account-profile__panel-heading">
                    <h2>{t('editProfile')}</h2>
                    <p>{t('profileHint')}</p>
                  </header>
                  <NForm
                    class="r-account-profile__form"
                    {...{ method: 'post' }}
                    labelPlacement="top"
                    showFeedback={false}
                    onSubmit={saveProfile}
                  >
                    <div class="r-account-profile__fields">
                      <NFormItem
                        label={t('name')}
                        labelProps={{ for: nameId }}
                        required
                      >
                        <NInput
                          v-model:value={form.name}
                          disabled={saving.value}
                          inputProps={{
                            id: nameId,
                            name: 'name',
                            autocomplete: 'name',
                            required: true,
                            maxlength: 60,
                          }}
                        />
                      </NFormItem>
                      <NFormItem
                        label={t('phone')}
                        labelProps={{ for: phoneId }}
                      >
                        <NInput
                          v-model:value={form.phone}
                          disabled={saving.value}
                          inputProps={{
                            id: phoneId,
                            name: 'phone',
                            type: 'tel',
                            autocomplete: 'tel',
                            maxlength: 24,
                          }}
                        />
                      </NFormItem>
                      <NFormItem
                        label={t('username')}
                        labelProps={{ for: usernameId }}
                      >
                        <NInput
                          value={account.username}
                          readonly
                          themeOverrides={readonlyInputTheme}
                          inputProps={{ id: usernameId }}
                        />
                      </NFormItem>
                      <NFormItem
                        label={t('email')}
                        labelProps={{ for: emailId }}
                      >
                        <NInput
                          value={account.email}
                          readonly
                          themeOverrides={readonlyInputTheme}
                          inputProps={{ id: emailId }}
                        />
                      </NFormItem>
                    </div>
                    {formError.value && (
                      <NAlert type="error" {...{ role: 'alert' }}>
                        {formError.value}
                      </NAlert>
                    )}
                    <div class="r-account-profile__actions">
                      <NButton
                        attrType="submit"
                        type="primary"
                        loading={saving.value}
                      >
                        {t('saveProfile')}
                      </NButton>
                    </div>
                  </NForm>
                </section>
                <section
                  id={panelId('security')}
                  class="r-account-profile__panel"
                  role="tabpanel"
                  aria-labelledby={tabId('security')}
                  hidden={activeSection.value !== 'security'}
                  tabindex={0}
                >
                  {activeSection.value === 'security' && (
                    <>
                      <header class="r-account-profile__panel-heading">
                        <h2>{t('changePassword')}</h2>
                        <p>
                          {t(
                            apiMockEnabled
                              ? 'demoPasswordNotice'
                              : 'revokeNotice',
                          )}
                        </p>
                      </header>
                      <AccountPasswordForm
                        class="r-account-profile__form r-account-profile__password-form"
                        username={account.username}
                        compact
                        requireCurrent
                        save={savePassword}
                      />
                    </>
                  )}
                </section>
              </div>
            </>
          )}
        </section>
      )
    }
  },
})
