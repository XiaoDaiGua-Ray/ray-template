import { axiosInterceptor } from '@/axios/utils/interceptor'
import implement from './provider'

const { setImplement } = axiosInterceptor()

export const setupRequestInterceptor = () => {
  const { implementRequestInterceptorArray } = implement

  setImplement(
    'implementRequestInterceptorArray',
    implementRequestInterceptorArray,
    'ok',
  )
}

export const setupRequestErrorInterceptor = () => {
  const { implementRequestInterceptorErrorArray } = implement

  setImplement(
    'implementRequestInterceptorErrorArray',
    implementRequestInterceptorErrorArray,
    'error',
  )
}
