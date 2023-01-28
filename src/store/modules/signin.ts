/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-28
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 出于便捷性考虑, 将用户部分信息存于 pinia 仓库
 *
 * 可以存储: 头像, 权限, 以及基于你项目实际情况的一些附带信息
 *
 * 如果检测权限发生变动, 则会强制重新登陆
 */

import { isEmpty } from 'lodash-es'
import { logout } from '@/utils/user'

export interface SigninForm extends IUnknownObjectKey {
  name: string
  pwd: string
}

export const useSignin = defineStore(
  'signin',
  () => {
    const state = reactive({
      role: '',
    })

    /**
     *
     * @param signinForm 用户登录信息
     * @returns 状态码
     *
     * @remark 0: 登陆成功, 1: 登陆失败
     */
    const signin = (signinForm: SigninForm) => {
      if (!isEmpty(signinForm)) {
        state.role = 'admin'

        return 0
      } else {
        return 1
      }
    }

    return {
      ...toRefs(state),
      signin,
    }
  },
  {
    persist: {
      key: 'piniaSigninStore',
    },
  },
)
