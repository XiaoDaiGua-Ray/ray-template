import './index.scss'
import { NResult, NButton } from 'naive-ui'

const ErrorPage = defineComponent({
  name: 'ErrorPage',
  setup() {
    const router = useRouter()

    const {
      rootRoute: { path },
    } = __APP_CFG__

    const handleBack = () => {
      router.push(path)
    }

    return {
      handleBack,
    }
  },
  render() {
    return (
      <div class="error-page">
        <NResult status="500" title="小调皮你走错地方了">
          {{
            footer: () => (
              <NButton onClick={this.handleBack.bind(this)}>返回首页</NButton>
            ),
          }}
        </NResult>
      </div>
    )
  },
})

export default ErrorPage
