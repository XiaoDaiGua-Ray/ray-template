import type { PaginationResponse } from '@/types/modules/axios'
import { faker } from '@faker-js/faker/locale/zh_CN'
import type { Person, PersonListParams } from '@ray-template/api-contracts/demo'

export type { Person, PersonListParams } from '@ray-template/api-contracts/demo'

let people: Person[] | undefined

export const listPeople = ({
  page,
  pageSize,
  email,
  name,
  sortAge,
}: PersonListParams = {}): PaginationResponse<Person[]> => {
  // 同一会话内复用数据，让翻页和从上一页复制的搜索词都可重复使用。
  people ??= Array.from({ length: 100 }, () => ({
    id: faker.string.uuid(),
    address: faker.location.state() + faker.location.city(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 60 }),
    createDate: faker.date.past().toISOString().slice(0, 10),
  }))

  const emailQuery = email?.trim().toLowerCase()
  const nameQuery = name?.trim().toLowerCase()
  const matches = people.filter(
    (person) =>
      (!emailQuery || person.email.toLowerCase().includes(emailQuery)) &&
      (!nameQuery || person.name.toLowerCase().includes(nameQuery)),
  )

  if (sortAge) {
    const direction = sortAge === 'ascend' ? 1 : -1

    matches.sort((left, right) => direction * (left.age - right.age))
  }

  const validPage = page !== void 0 && Number.isSafeInteger(page) && page > 0
  const validSize =
    pageSize !== void 0 && Number.isSafeInteger(pageSize) && pageSize > 0
  const start = validPage && validSize ? (page - 1) * pageSize : 0

  return {
    code: 200,
    msg: '请求成功',
    data:
      validPage && validSize ? matches.slice(start, start + pageSize) : matches,
    total: matches.length,
  }
}
