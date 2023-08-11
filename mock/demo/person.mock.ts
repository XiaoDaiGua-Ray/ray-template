import { defineMock } from 'vite-plugin-mock-dev-server'
import Mock from 'mockjs'
import { pagination, stringify, response } from '../shared/utils'
import { array } from '../shared/database'

export const getPersonList = defineMock({
  url: '/api/list',
  method: 'GET',
  delay: 500,
  response: (req, res) => {
    const person = () => ({
      id: Mock.Random.guid(),
      address: Mock.Random.county(true),
      email: Mock.Random.email(),
      name: Mock.Random.cname(),
      age: Mock.Random.integer(18, 60),
      createDate: Mock.Random.date(),
    })

    const {
      query: { page, pageSize, email },
    } = req
    let list = array(100).map(() => person())
    let length = list.length

    if (!page || !pageSize) {
      res.end(
        stringify(
          response(list, 200, '请求成功', {
            total: length,
          }),
        ),
      )
    } else {
      list = pagination(page, pageSize, list)

      if (email) {
        list = list.filter((curr) => curr.email.includes(email))
        length = list.length
      }

      res.end(
        stringify(
          response(list, 200, '请求成功', {
            total: length,
          }),
        ),
      )
    }
  },
})
