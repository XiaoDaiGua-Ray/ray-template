import { createUser, updateUser } from '@/api/admin'
import { AdminApiError } from '@/api/admin/client'
import type { AdminUser, UserInput, UserOptions } from '@/api/admin/contracts'
import { RForm, useForm } from '@/components'
import { useI18n } from '@/hooks'
import {
  NAlert,
  NButton,
  NFlex,
  NFormItem,
  NInput,
  NModal,
  NRadio,
  NRadioGroup,
  NSelect,
} from 'naive-ui'
import type { FormRules, InputInst } from 'naive-ui'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'UserEditor',
  props: {
    user: { type: Object as PropType<AdminUser>, default: void 0 },
    options: { type: Object as PropType<UserOptions>, required: true },
    departmentId: { type: String, default: void 0 },
    currentUserId: { type: String, default: void 0 },
  },
  emits: { close: () => true, saved: (_user: AdminUser) => true },
  setup(props, { emit }) {
    const { t } = useI18n('userManagement')
    const { t: translate } = useI18n()
    const initial: UserInput = {
      username: props.user?.username ?? '',
      name: props.user?.name ?? '',
      email: props.user?.email ?? '',
      phone: props.user?.phone ?? '',
      departmentId:
        props.user?.departmentId ??
        props.departmentId ??
        props.options.departments.find((item) => item.parentId)?.id ??
        props.options.departments[0]?.id ??
        '',
      role:
        props.user?.role ??
        props.options.roles.find(
          (item) => item.value === 'member' && !item.disabled,
        )?.value ??
        props.options.roles.find((item) => !item.disabled)?.value ??
        '',
      status: props.user?.status ?? 'enabled',
      remark: props.user?.remark ?? '',
    }
    const [register, { validate, formConditionRef: model }] =
      useForm<UserInput>(initial)
    const saving = ref(false)
    const error = ref('')
    const discardRequested = ref(false)
    const firstInput = shallowRef<InputInst>()
    const formElement = shallowRef<HTMLElement>()
    const id = useId()
    const self = props.user?.id === props.currentUserId
    const rules = computed<FormRules>(() => ({
      username: [
        { required: true, message: t('required'), trigger: 'blur' },
        {
          validator: (_, value: string) =>
            value.trim().length >= 2 &&
            value.trim().length <= 32 &&
            /^\S+$/u.test(value.trim()),
          message: t('usernameHint'),
          trigger: 'blur',
        },
      ],
      name: {
        required: true,
        whitespace: true,
        message: t('required'),
        trigger: 'blur',
      },
      email: [
        { required: true, message: t('required'), trigger: 'blur' },
        { type: 'email', message: t('emailInvalid'), trigger: 'blur' },
      ],
      departmentId: {
        required: true,
        message: t('required'),
        trigger: 'change',
      },
      role: { required: true, message: t('required'), trigger: 'change' },
    }))
    const close = () => {
      if (saving.value) return

      if (JSON.stringify(model.value) !== JSON.stringify(initial))
        discardRequested.value = true
      else emit('close')
    }
    const submit = async (event: Event) => {
      event.preventDefault()

      if (saving.value) return

      saving.value = true
      error.value = ''

      try {
        try {
          await validate()
        } catch (reason) {
          await nextTick()
          const field = Array.isArray(reason)
            ? reason
                .flat()
                .find((item) => item && typeof item.field === 'string')?.field
            : ''
          const control = ['username', 'name', 'email'].includes(field)
            ? formElement.value?.querySelector<HTMLElement>(
                `input[name="${field}"]`,
              )
            : formElement.value?.querySelector<HTMLElement>(
                '.n-base-selection [tabindex="0"], .n-base-selection input',
              )

          if (control) control.focus()
          else firstInput.value?.focus()

          return
        }

        const user = props.user
          ? await updateUser(props.user.id, model.value)
          : await createUser(model.value)

        emit('saved', user)
      } catch (reason) {
        error.value = t(
          `errors.${reason instanceof AdminApiError ? reason.key : 'requestFailed'}`,
        )
      } finally {
        saving.value = false
      }
    }

    return () => (
      <NModal
        show
        preset="card"
        class="user-management__modal"
        title={t(props.user ? 'editUser' : 'createUser')}
        aria-label={t(props.user ? 'editUser' : 'createUser')}
        maskClosable={false}
        onUpdateShow={(show) => {
          if (!show) close()
        }}
        onAfterEnter={() => firstInput.value?.focus()}
      >
        <div ref={formElement}>
          <RForm
            model={model.value}
            rules={rules.value}
            labelPlacement="top"
            onRegister={register}
            onSubmit={submit}
            {...{
              novalidate: true,
              onKeydown: (event: KeyboardEvent) => {
                if (event.isComposing && event.key === 'Enter')
                  event.preventDefault()
              },
            }}
          >
            <div class="user-management__form-grid">
              <NFormItem
                label={t('username')}
                labelProps={{ for: `${id}-username` }}
                path="username"
              >
                <NInput
                  ref={firstInput}
                  v-model:value={model.value.username}
                  maxlength={32}
                  inputProps={{
                    id: `${id}-username`,
                    name: 'username',
                    required: true,
                    autocapitalize: 'off',
                    spellcheck: false,
                  }}
                  placeholder={t('usernameHint')}
                />
              </NFormItem>
              <NFormItem
                label={t('name')}
                labelProps={{ for: `${id}-name` }}
                path="name"
              >
                <NInput
                  v-model:value={model.value.name}
                  maxlength={60}
                  inputProps={{
                    id: `${id}-name`,
                    name: 'name',
                    required: true,
                  }}
                  placeholder={t('nameHint')}
                />
              </NFormItem>
              <NFormItem
                label={t('email')}
                labelProps={{ for: `${id}-email` }}
                path="email"
              >
                <NInput
                  v-model:value={model.value.email}
                  maxlength={120}
                  inputProps={{
                    id: `${id}-email`,
                    name: 'email',
                    type: 'email',
                    required: true,
                    autocapitalize: 'off',
                    spellcheck: false,
                  }}
                  placeholder="user@example.com"
                />
              </NFormItem>
              <NFormItem
                label={t('phone')}
                labelProps={{ for: `${id}-phone` }}
                path="phone"
              >
                <NInput
                  v-model:value={model.value.phone}
                  maxlength={24}
                  inputProps={{ id: `${id}-phone`, name: 'phone', type: 'tel' }}
                  placeholder={t('optional')}
                />
              </NFormItem>
              <NFormItem
                label={t('department')}
                labelProps={{ id: `${id}-department` }}
                path="departmentId"
              >
                <NSelect
                  v-model:value={model.value.departmentId}
                  aria-labelledby={`${id}-department`}
                  options={props.options.departments.map((item) => ({
                    value: item.id,
                    label: item.labelKey ? translate(item.labelKey) : item.name,
                  }))}
                  filterable
                />
              </NFormItem>
              <NFormItem
                label={t('role')}
                labelProps={{ id: `${id}-role` }}
                path="role"
              >
                <NSelect
                  v-model:value={model.value.role}
                  aria-labelledby={`${id}-role`}
                  disabled={self}
                  options={props.options.roles.map((item) => ({
                    ...item,
                    label: item.labelKey
                      ? translate(item.labelKey)
                      : item.label,
                  }))}
                />
              </NFormItem>
              <NFormItem
                label={t('status')}
                labelProps={{ id: `${id}-status` }}
              >
                <NRadioGroup
                  v-model:value={model.value.status}
                  aria-labelledby={`${id}-status`}
                  disabled={self}
                  name={`${id}-status`}
                >
                  <NFlex>
                    <NRadio value="enabled">{t('enabled')}</NRadio>
                    <NRadio value="disabled">{t('disabled')}</NRadio>
                  </NFlex>
                </NRadioGroup>
              </NFormItem>
              <NFormItem
                class="user-management__form-wide"
                label={t('remark')}
                labelProps={{ for: `${id}-remark` }}
              >
                <NInput
                  v-model:value={model.value.remark}
                  type="textarea"
                  maxlength={300}
                  showCount
                  inputProps={{ id: `${id}-remark`, name: 'remark' }}
                  placeholder={t('optional')}
                />
              </NFormItem>
            </div>
            {error.value && (
              <NAlert type="error" class="user-management__feedback">
                {error.value}
              </NAlert>
            )}
            <div
              class="user-management__discard"
              style={{
                visibility: discardRequested.value ? 'visible' : 'hidden',
              }}
              role={discardRequested.value ? 'status' : void 0}
            >
              <span>{t('unsaved')}</span>
              <NButton
                size="small"
                type="warning"
                disabled={saving.value}
                onClick={() => emit('close')}
              >
                {t('discard')}
              </NButton>
            </div>
            <NFlex justify="end">
              <NButton disabled={saving.value} onClick={close}>
                {t('cancel')}
              </NButton>
              <NButton type="primary" attrType="submit" loading={saving.value}>
                {t('save')}
              </NButton>
            </NFlex>
          </RForm>
        </div>
      </NModal>
    )
  },
})
