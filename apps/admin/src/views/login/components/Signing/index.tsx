import { APP_CATCH_KEY } from '@/app-config'
import { RForm, useForm } from '@/components'
import { useAppRoot, useI18n } from '@/hooks'
import { resolveLandingPath } from '@/router/utils/resolve-landing-path'
import { useSigningActions } from '@/store'
import { setStorage } from '@/utils'
import { NButton, NFlex, NFormItem, NInput } from 'naive-ui'

export default defineComponent({
  name: 'RSigning',
  setup() {
    const [register, { validate }] = useForm()
    const { t } = useI18n('views.login.index')
    const { signing } = useSigningActions()
    const { getRootPath } = useAppRoot()
    const router = useRouter()
    const loading = ref(false)
    const signingForm = reactive({ name: '', pwd: '' })
    const nameId = useId()
    const passwordId = useId()

    const rules = computed(() => ({
      name: {
        required: true,
        message: t('NamePlaceholder'),
        trigger: ['blur', 'input'],
      },
      pwd: {
        required: true,
        message: t('PasswordPlaceholder'),
        trigger: ['blur', 'input'],
      },
    }))

    const handleLogin = async (event?: Event) => {
      event?.preventDefault()

      if (loading.value) return

      try {
        await validate()
      } catch {
        return
      }

      loading.value = true

      try {
        const res = await signing(signingForm)

        if (res.code !== 0) throw new Error(res.message)

        setStorage(APP_CATCH_KEY.signing, res.data, 'localStorage')
        await router.push(resolveLandingPath(router, getRootPath.value))
      } catch {
        window.$message.error(t('SignInError'))
      } finally {
        loading.value = false
      }
    }

    return () => (
      <RForm
        model={signingForm}
        onRegister={register}
        rules={rules.value}
        onSubmit={handleLogin}
      >
        <NFormItem label={t('Name')} labelProps={{ for: nameId }} path="name">
          <NInput
            v-model:value={signingForm.name}
            inputProps={{
              id: nameId,
              name: 'ray-demo-user',
              autocomplete: 'off',
              enterkeyhint: 'next',
            }}
            placeholder={t('NamePlaceholder')}
          />
        </NFormItem>
        <NFormItem
          label={t('Password')}
          labelProps={{ for: passwordId }}
          path="pwd"
        >
          <NInput
            v-model:value={signingForm.pwd}
            inputProps={{
              id: passwordId,
              name: 'ray-demo-password',
              autocomplete: 'off',
              enterkeyhint: 'go',
            }}
            type="password"
            showPasswordOn="click"
            placeholder={t('PasswordPlaceholder')}
          />
        </NFormItem>
        <NFlex vertical>
          <NButton
            block
            type="primary"
            attrType="submit"
            loading={loading.value}
          >
            {t('Login')}
          </NButton>
          <NButton
            block
            secondary
            attrType="button"
            disabled={loading.value}
            onClick={() => {
              signingForm.name = 'Ray Admin'
              signingForm.pwd = '123456'
              void handleLogin()
            }}
          >
            {t('UseDemo')}
          </NButton>
          <NFlex>
            {(['manager', 'member'] as const).map((role) => (
              <NButton
                secondary
                disabled={loading.value}
                onClick={() => {
                  signingForm.name = role
                  signingForm.pwd = '123456'
                  void handleLogin()
                }}
              >
                {t(role === 'manager' ? 'UseManager' : 'UseMember')}
              </NButton>
            ))}
          </NFlex>
        </NFlex>
      </RForm>
    )
  },
})
