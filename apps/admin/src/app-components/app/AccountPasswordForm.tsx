import { AdminApiError } from '@/api/admin/client'
import { credentialInputSchema } from '@/api/admin/contracts'
import { useI18n } from '@/hooks'
import { NAlert, NButton, NForm, NFormItem, NInput } from 'naive-ui'
import * as v from 'valibot'
import type { PropType } from 'vue'

const passwordErrors = new Set([
  'invalidCurrentPassword',
  'passwordUnchanged',
  'credentialChanged',
  'forbidden',
  'selfProtected',
  'notFound',
  'tooManyRequests',
])

export default defineComponent({
  name: 'AccountPasswordForm',
  props: {
    username: { type: String, required: true },
    requireCurrent: Boolean,
    compact: Boolean,
    save: {
      type: Function as PropType<
        (newPassword: string, currentPassword: string) => Promise<void>
      >,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n('account')
    const current = ref('')
    const next = ref('')
    const confirmation = ref('')
    const error = ref('')
    const saving = ref(false)
    const currentId = useId()
    const newId = useId()
    const confirmId = useId()
    const hintId = useId()
    const newLabelId = useId()

    const submit = async (event: Event) => {
      event.preventDefault()

      if (saving.value) return

      if (!v.is(credentialInputSchema, { newPassword: next.value })) {
        error.value = t('passwordHint')

        return
      }

      if (next.value !== confirmation.value) {
        error.value = t('passwordMismatch')

        return
      }

      error.value = ''
      saving.value = true

      try {
        await props.save(next.value, current.value)
        current.value = ''
        next.value = ''
        confirmation.value = ''
      } catch (reason) {
        error.value = t(
          reason instanceof AdminApiError && passwordErrors.has(reason.key)
            ? reason.key
            : 'saveFailed',
        )
      } finally {
        saving.value = false
      }
    }

    const field = (
      label: string,
      id: string,
      value: Ref<string>,
      autocomplete: 'current-password' | 'new-password',
    ) => (
      <NFormItem
        class={id === currentId ? 'r-account-password-form__current' : void 0}
        label={t(label)}
        labelProps={{ for: id }}
        required
        showRequireMark={props.compact && id === newId ? false : void 0}
      >
        {{
          default: () => (
            <NInput
              value={value.value}
              onUpdateValue={(input) => (value.value = input)}
              type="password"
              showPasswordOn="click"
              disabled={saving.value}
              inputProps={{
                id,
                name: label,
                autocomplete,
                required: true,
                maxlength: 128,
                'aria-describedby': id === newId ? hintId : void 0,
                'aria-labelledby':
                  props.compact && id === newId ? newLabelId : void 0,
              }}
            />
          ),
          label:
            props.compact && id === newId
              ? () => (
                  <>
                    <span id={newLabelId}>{t(label)}</span>
                    <span
                      class="r-account-password-form__required"
                      aria-hidden="true"
                    >
                      *
                    </span>
                    <span id={hintId} class="r-account-password-form__hint">
                      {t('passwordHint')}
                    </span>
                  </>
                )
              : void 0,
          feedback: () =>
            !props.compact &&
            id === newId && <span id={hintId}>{t('passwordHint')}</span>,
        }}
      </NFormItem>
    )

    return () => (
      <NForm
        {...{
          method: 'post',
          autocomplete: props.requireCurrent ? 'on' : 'off',
        }}
        showFeedback={!props.compact}
        onSubmit={submit}
      >
        {props.requireCurrent && (
          <input
            type="hidden"
            name="username"
            value={props.username}
            autocomplete="username"
          />
        )}
        {props.requireCurrent &&
          field('currentPassword', currentId, current, 'current-password')}
        {field('newPassword', newId, next, 'new-password')}
        {field('confirmPassword', confirmId, confirmation, 'new-password')}
        {error.value && (
          <NAlert type="error" {...{ role: 'alert' }}>
            {error.value}
          </NAlert>
        )}
        <div class="r-account-password-form__actions">
          <NButton type="primary" attrType="submit" loading={saving.value}>
            {t(props.requireCurrent ? 'changePassword' : 'setPassword')}
          </NButton>
        </div>
      </NForm>
    )
  },
})
