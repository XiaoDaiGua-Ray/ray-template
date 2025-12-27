/**
 *
 * 错误页面
 *
 * 基于 NResult 组件实现, 继承该组件所有 props 与 slots
 * 可以当作一个组件使用, 也可以当作一个页面调用
 */

import './index.scss'
import { redirectRouterToDashboard } from '@/router/utils'
import { useSettingGetters } from '@/store'
import { NButton, NFlex, NResult, resultProps } from 'naive-ui'
import type { ResultProps } from 'naive-ui'

const PageResult = defineComponent({
  name: 'PageResult',
  props: {
    ...resultProps,
  },
  setup() {
    const { replace } = useRouter()

    const goBack = () => {
      const { getAppRootRoute } = useSettingGetters()

      if (getAppRootRoute.value?.path) {
        replace(getAppRootRoute.value.path)
      }
    }

    return {
      goBack,
    }
  },
  render() {
    const { goBack } = this

    return (
      <div class="error-page">
        <NResult
          {...(this.$props as ResultProps)}
          status="500"
          title="404 资源不存在"
          description="小调皮你走错地方了"
        >
          {{
            ...this.$slots,
            footer: () => (
              <NFlex align="center" justify="center">
                <NButton onClick={redirectRouterToDashboard.bind(this, true)}>
                  返回首页
                </NButton>
                <NButton type="primary" onClick={goBack.bind(this)}>
                  返回上一页面
                </NButton>
              </NFlex>
            ),
          }}
        </NResult>
      </div>
    )
  },
})

export default PageResult
