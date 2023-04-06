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
 * 可以存储: 头像, 权限, 以及基于你项目实际情况的一些附带信息
 *
 * 使用 sessionStorage 缓存部分用户信息
 *
 * 默认仅缓存 signinCallback 属性
 */

import { isEmpty } from 'lodash-es'
import { removeCache } from '@/utils/cache'

export interface SigninForm extends IUnknownObjectKey {
  name: string
  pwd: string
}

export interface SigninCallback extends IUnknownObjectKey {
  role: string
  name: string
}

export const useSignin = defineStore(
  'signin',
  () => {
    const state = reactive({
      /**
       *
       * 登陆返回信息(可以存放用户名、权限、头像等一些信息)
       * 路由鉴权依赖该属性中的 role 属性, 如果需要更改请同步更改: router/basic.ts、router/permission.ts
       */
      signinCallback: {} as SigninCallback,
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
        state.signinCallback = {
          role: 'admin',
          name: signinForm.name,
        }

        return 0
      } else {
        return 1
      }
    }

    /**
     *
     * 退出登陆并且清空缓存数据
     * 延迟 300ms 后强制刷新当前系统
     */
    const logout = () => {
      window.$message.info('账号退出中...')
      removeCache('all-sessionStorage')

      setTimeout(() => window.location.reload(), 300)
    }

    return {
      ...toRefs(state),
      signin,
      logout,
    }
  },
  {
    persist: {
      key: 'piniaSigninStore',
      paths: ['signinCallback'],
      storage: sessionStorage,
    },
  },
)
