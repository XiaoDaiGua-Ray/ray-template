import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { setCache } from '@/utils/cache'
import { useSpin } from '@/spin'

import type { FormInst } from 'naive-ui'

const Signin = defineComponent({
  name: 'Signin',
  setup() {
    const { t } = useI18n()

    const useSigninForm = () => ({
      name: 'ray',
      pwd: '123456',
    })

    const router = useRouter()
    const signinForm = ref(useSigninForm())
    const loginFormRef = ref<FormInst>()

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
          useSpin(true)

          setTimeout(() => {
            router.push('/dashboard')

            useSpin(false)

            window.$message.success(`欢迎${signinForm.value.name}登陆~`)

            setCache('token', 'tokenValue')
            setCache('person', signinForm.value)
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
        >
          {this.t('LoginModule.Login')}
        </NButton>
      </NForm>
    )
  },
})

export default Signin
