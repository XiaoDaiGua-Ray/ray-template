import { faker } from '@faker-js/faker/locale/zh_CN'

/**
 *
 * @param option 自定义配置
 *
 * 基础表格数据
 */
export function tableMock(option?: object) {
  return {
    ...option,
    id: faker.string.uuid(),
    address: faker.location.state() + faker.location.city(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 60 }),
    createDate: faker.date.past().toISOString().slice(0, 10),
  }
}
