import './index.scss'
import {
  NSpace,
  NCard,
  NTabs,
  NTabPane,
  NGradientText,
  NDropdown,
  NDivider,
} from 'naive-ui'
import Signin from './components/Signin/index'
import Register from './components/Register/index'
import { useSetting } from '@/store'
import RayIcon from '@/components/RayIcon'
import { useLanguageOptions } from '@/language/index'
import RayLink from '@/components/RayLink/index'

const Login = defineComponent({
  name: 'Login',
  setup() {
    const state = reactive({
      tabsValue: 'signin',
    })
    const { t } = useI18n()
    const { height: windowHeight } = useWindowSize()
    const settingStore = useSetting()
    const { updateLocale } = settingStore

    return {
      ...toRefs(state),
      windowHeight,
      updateLocale,
      ray: t,
    }
  },
  render() {
    return (
      <div class={['login']} style={[`height: ${this.windowHeight}px`]}>
        <NSpace>
          <NGradientText class="login-title" type="info">
            Ray Template
          </NGradientText>
          <NDropdown
            options={useLanguageOptions()}
            onSelect={(key) => this.updateLocale(key)}
          >
            <RayIcon customClassName="login-icon" name="language" size="18" />
          </NDropdown>
        </NSpace>
        <NCard>
          <NTabs v-model:value={this.tabsValue}>
            <NTabPane tab={this.ray('LoginModule.Signin')} name="signin">
              <Signin />
            </NTabPane>
            <NTabPane tab={this.ray('LoginModule.Register')} name="register">
              <Register />
            </NTabPane>
          </NTabs>
          <NDivider>友情链接</NDivider>
          <RayLink />
        </NCard>
      </div>
    )
  },
})

export default Login
