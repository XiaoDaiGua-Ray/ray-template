/**
 *
 * 出于便捷性考虑, 将用户部分信息存于 pinia 仓库
 * 可以存储: 头像, 权限, 以及基于你项目实际情况的一些附带信息
 *
 * 使用 sessionStorage 缓存部分用户信息
 *
 * 默认仅缓存 SigningCallback 属性
 */

import { isEmpty } from 'lodash-es'
import { removeStorage } from '@/utils'
import { APP_CATCH_KEY } from '@/app-config'
import { useSiderBar } from '@/hooks'

import type {
  SigningForm,
  SigningCallback,
  SigningResponse,
} from '@/store/modules/signing/types'

export const piniaSigningStore = defineStore(
  'signing',
  () => {
    const state = reactive({
      /**
       *
       * 登陆返回信息(可以存放用户名、权限、头像等一些信息)
       * 路由鉴权依赖该属性中的 role 属性, 如果需要更改请同步更改: router/basic.ts、router/permission.ts
       */
      signingCallback: {} as SigningCallback,
    })

    /**
     *
     * @param SigningForm 用户登录信息
     *
     * @description
     * 0: 登陆成功, 1: 登陆失败
     */
    const signing = (SigningForm: SigningForm): Promise<SigningResponse> => {
      return new Promise((resolve, reject) => {
        if (!isEmpty(SigningForm)) {
          state.signingCallback = {
            role: 'admin',
            name: SigningForm.name,
            avatar: 'https://avatars.githubusercontent.com/u/51957438?v=4',
          }

          resolve({
            code: 0,
            message: '登陆成功',
            data: state.signingCallback,
          })
        } else {
          reject({
            code: 1,
            message: '登陆失败',
            data: null,
          })
        }
      })
    }

    /**
     *
     * @param toSigning 是否需要退出登录，并且重定向至登录页
     *
     * @description
     * 清除所有登录缓存信息。
     * 如果 toSigning 传递 true 则会重定向至登录页。
     */
    const clearSigningCallback = (toSigning: boolean) => {
      const { closeAll } = useSiderBar()
      const {
        appPiniaMenuStore,
        appPiniaSigningStore,
        token,
        signing,
        appMenuKey,
      } = APP_CATCH_KEY

      // 提示信息
      window.$message.info('账号退出中...')
      // 移除所有 sessionStorage 缓存
      removeStorage('__all_sessionStorage__', 'sessionStorage')
      // 移除指定 localStorage 缓存
      removeStorage(appPiniaSigningStore, 'localStorage')
      removeStorage(appPiniaMenuStore, 'localStorage')
      removeStorage(token, 'localStorage')
      removeStorage(signing, 'localStorage')
      removeStorage(appMenuKey, 'localStorage')
      removeStorage(APP_CATCH_KEY.isAppLockScreen, 'localStorage')
      // 关闭所有侧边栏标签
      closeAll()

      if (toSigning) {
        window.location.replace('#/')

        setTimeout(() => {
          window.location.reload()
        }, 0)
      }
    }

    /**
     *
     * 退出登陆并且清空缓存数据
     * 延迟 300ms 后强制刷新当前系统
     */
    const logout = () => {
      clearSigningCallback(true)
    }

    return {
      ...toRefs(state),
      signing,
      logout,
      clearSigningCallback,
    }
  },
  {
    persist: {
      key: APP_CATCH_KEY.appPiniaSigningStore,
      pick: ['signingCallback'],
      storage: window.localStorage,
    },
  },
)
