import { request } from '@/axios/index'

import type { BasicResponse, PaginationResponse } from '@/types/modules/axios'

export interface MockListParams {
  page: number
  pageSize: number
}

export interface Person {
  name: string
  id: string
  age: number
  address: string
  createDate: string
  email: string | null
}

export const getPersonList = (
  params: Partial<Pick<MockListParams & Person, 'email' | 'pageSize' | 'page'>>,
) => {
  return request<PaginationResponse<Person[]>>({
    url: '/api/list',
    method: 'get',
    params,
  })
}
