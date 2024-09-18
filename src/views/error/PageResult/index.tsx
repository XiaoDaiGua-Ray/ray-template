/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 错误页面
 *
 * 基于 NResult 组件实现, 继承该组件所有 props 与 slots
 * 可以当作一个组件使用, 也可以当作一个页面调用
 */

import './index.scss'

import { NResult, NButton, NFlex } from 'naive-ui'

import { redirectRouterToDashboard } from '@/router/utils'
import { resultProps } from 'naive-ui'
import { getStorage } from '@/utils'
import { useVueRouter } from '@/hooks'
import { APP_CATCH_KEY } from '@/app-config'

import type { ResultProps } from 'naive-ui'

const PageResult = defineComponent({
  name: 'PageResult',
  props: {
    ...resultProps,
  },
  setup() {
    const { router } = useVueRouter()

    const goBack = () => {
      const { appMenuKey } = APP_CATCH_KEY
      const key = getStorage(appMenuKey, 'sessionStorage', {
        defaultValue: '',
      })

      if (key) {
        router.replace(key)
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
