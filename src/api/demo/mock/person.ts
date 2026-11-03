import { request } from '@/axios'
import type { Person, PersonListParams } from '@/demo-data/people'
import type { PaginationResponse } from '@/types'

export type { Person, PersonListParams } from '@/demo-data/people'

export const getPersonList = async (
  params: PersonListParams,
  signal?: AbortSignal,
) => {
  if (import.meta.env.DEV) {
    return request<PaginationResponse<Person[]>>({
      url: '/api/list',
      method: 'get',
      params,
      signal,
      cancelConfig: { cancel: !signal },
    })
  }

  const { listPeople } = await import('@/demo-data/people')

  return listPeople(params)
}
