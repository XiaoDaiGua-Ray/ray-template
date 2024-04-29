var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// mock-data-1714404645819.js
import { transformMockData } from "vite-plugin-mock-dev-server";

// mock/demo/person.mock.ts
var person_mock_exports = {};
__export(person_mock_exports, {
  getPersonList: () => getPersonList
});
import { defineMock } from "vite-plugin-mock-dev-server";

// mock/shared/utils.ts
function array(length) {
  return new Array(length).fill(0);
}
function pagination(pageCurrent, pageSize, array2) {
  const offset = (pageCurrent - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array2.length ? array2.slice(offset, array2.length) : array2.slice(offset, offset + Number(pageSize));
}
function stringify(value) {
  return JSON.stringify(value);
}
function response(res, code, msg, params) {
  const basic = {
    code,
    msg,
    data: res,
    ...params
  };
  return basic;
}

// mock/shared/database.ts
import Mock from "mockjs";
function tableMock(option) {
  return {
    ...option,
    id: Mock.Random.guid(),
    address: Mock.Random.county(true),
    email: Mock.Random.email(),
    name: Mock.Random.cname(),
    age: Mock.Random.integer(18, 60),
    createDate: Mock.Random.date()
  };
}

// mock/demo/person.mock.ts
var getPersonList = defineMock({
  url: "/api/list",
  method: "GET",
  delay: 500,
  response: (req, res) => {
    const {
      query: { page, pageSize, email }
    } = req;
    let list = array(100).map(() => tableMock());
    let length = list.length;
    if (!page || !pageSize) {
      res.end(
        stringify(
          response(list, 200, "\u8BF7\u6C42\u6210\u529F", {
            total: length
          })
        )
      );
    } else {
      list = pagination(page, pageSize, list);
      if (email) {
        list = list.filter((curr) => curr.email.includes(email));
        length = list.length;
      }
      res.end(
        stringify(
          response(list, 200, "\u8BF7\u6C42\u6210\u529F", {
            total: length
          })
        )
      );
    }
  }
});

// mock-data-1714404645819.js
var exporters = [person_mock_exports];
var mockList = exporters.map((raw) => {
  let mockConfig;
  if (raw.default) {
    mockConfig = raw.default;
  } else {
    mockConfig = [];
    Object.keys(raw || {}).forEach((key) => {
      Array.isArray(raw[key]) ? mockConfig.push(...raw[key]) : mockConfig.push(raw[key]);
    });
  }
  return mockConfig;
});
var mock_data_1714404645819_default = transformMockData(mockList);
export {
  mock_data_1714404645819_default as default
};
