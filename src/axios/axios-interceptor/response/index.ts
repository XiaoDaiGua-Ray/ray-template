import { useAxiosInterceptor } from '@/axios/utils/interceptor'
import implement from './provider'

const { setImplement } = useAxiosInterceptor()

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
