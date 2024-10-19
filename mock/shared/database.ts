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
