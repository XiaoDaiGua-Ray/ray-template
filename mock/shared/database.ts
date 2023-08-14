/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import Mock from 'mockjs'

/**
 *
 * @param option 自定义配置
 *
 * 基础表格数据
 */
export function tableMock(option?: object) {
  return {
    ...option,
    id: Mock.Random.guid(),
    address: Mock.Random.county(true),
    email: Mock.Random.email(),
    name: Mock.Random.cname(),
    age: Mock.Random.integer(18, 60),
    createDate: Mock.Random.date(),
  }
}
