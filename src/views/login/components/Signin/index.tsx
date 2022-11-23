import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { setCache } from '@/utils/cache'

import type { FormInst } from 'naive-ui'

const Signin = defineComponent({
  name: 'Signin',
  setup() {
    const { t } = useI18n()

    const useSigninForm = () => ({
      name: 'admin',
      pwd: '123456',
    })

    const router = useRouter()
    const signinForm = ref(useSigninForm())
    const loginFormRef = ref<FormInst>()
    const loading = ref(false)

    const rules = {
      name: {
        required: true,
        message: t('LoginModule.NamePlaceholder'),
        trigger: ['blur', 'input'],
      },
      pwd: {
        required: true,
        message: t('LoginModule.PasswordPlaceholder'),
        trigger: ['blur', 'input'],
      },
    }

    const handleLogin = () => {
      loginFormRef.value?.validate((valid) => {
        if (!valid) {
          window.$message.info('登陆中...')

          loading.value = true

          setTimeout(() => {
            router.push('/dashboard')

            setCache('token', 'tokenValue')
          }, 2 * 1000)
        } else {
          window.$message.error('不可以这样哟, 不可以哟')
        }
      })
    }

    return {
      signinForm,
      loginFormRef,
      handleLogin,
      rules,
      loading,
      t,
    }
  },
  render() {
    return (
      <NForm model={this.signinForm} ref="loginFormRef" rules={this.rules}>
        <NFormItem label={this.t('LoginModule.Name')} path="name">
          <NInput
            v-model:value={this.signinForm.name}
            placeholder={this.t('LoginModule.NamePlaceholder')}
          />
        </NFormItem>
        <NFormItem label={this.t('LoginModule.Password')} path="pwd">
          <NInput
            v-model:value={this.signinForm.pwd}
            type="password"
            placeholder={this.t('LoginModule.PasswordPlaceholder')}
          />
        </NFormItem>
        <NButton
          style={['width: 100%', 'margin-to: 18px']}
          type="primary"
          onClick={this.handleLogin.bind(this)}
          loading={this.loading}
        >
          {this.t('LoginModule.Login')}
        </NButton>
      </NForm>
    )
  },
})

export default Signin
