import { defineMock } from 'vite-plugin-mock-dev-server'
import { pagination, stringify, response, array } from '@mock/shared/utils'
import { tableMock } from '@mock/shared/database'
import Mock from 'mockjs'

export const getPersonList = defineMock({
  url: '/api/list',
  method: 'GET',
  delay: 500,
  response: (req, res) => {
    const {
      query: { page, pageSize, email },
    } = req
    let list = array(100).map(() => tableMock())
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
