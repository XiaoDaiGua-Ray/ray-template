import { adminRequest } from '@/api/admin/client'
import { peopleResultSchema } from '@/api/demo/data'
import type { Person, PersonListParams } from '@/demo-data/people'
import type { PaginationResponse } from '@/types'

export type { Person, PersonListParams } from '@/demo-data/people'

export const getPersonList = async (
  params: PersonListParams,
  signal?: AbortSignal,
) => {
  const result = await adminRequest('demo/people', peopleResultSchema, {
    method: 'get',
    params,
    signal,
  })

  return {
    code: 200,
    msg: 'OK',
    data: result.items,
    total: result.total,
  } satisfies PaginationResponse<Person[]>
}
