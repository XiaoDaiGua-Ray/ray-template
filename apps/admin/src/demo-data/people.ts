import type { PersonListParams } from '@ray-template/api-contracts/demo'
import { listPeople as queryPeople } from '@ray-template/demo-data/people'

export type { Person, PersonListParams } from '@ray-template/api-contracts/demo'

export const listPeople = (params: PersonListParams = {}) => {
  const { items, total } = queryPeople(params)

  return { code: 200, msg: '请求成功', data: items, total }
}
