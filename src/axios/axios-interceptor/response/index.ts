import { axiosInterceptor } from '@/axios/utils/interceptor'
import implement from './provider'

const { setImplement } = axiosInterceptor()

export const setupResponseInterceptor = () => {
  const { implementResponseInterceptorArray } = implement

  setImplement(
    'implementResponseInterceptorArray',
    implementResponseInterceptorArray,
    'ok',
  )
}

export const setupResponseErrorInterceptor = () => {
  const { implementResponseInterceptorErrorArray } = implement

  setImplement(
    'implementResponseInterceptorErrorArray',
    implementResponseInterceptorErrorArray,
    'error',
  )
}
