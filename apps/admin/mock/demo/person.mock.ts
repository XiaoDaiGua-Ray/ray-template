import { listPeople } from '@/demo-data/people'
import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  url: '/api/list',
  method: 'GET',
  delay: 250,
  body: ({ query }) =>
    listPeople({
      page: Number(query.page),
      pageSize: Number(query.pageSize),
      email: typeof query.email === 'string' ? query.email : void 0,
      name: typeof query.name === 'string' ? query.name : void 0,
      sortAge:
        query.sortAge === 'ascend' || query.sortAge === 'descend'
          ? query.sortAge
          : void 0,
    }),
})
