import { processMockData, processRawData } from "vite-plugin-mock-dev-server/server";
import { faker } from "@faker-js/faker/locale/zh_CN";
import { defineMock } from "vite-plugin-mock-dev-server/helper";
// \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
// mock/shared/database.ts
/**
*
* @param option 自定义配置
*
* 基础表格数据
*/
function tableMock(option) {
	return {
		...option,
		id: faker.string.uuid(),
		address: faker.location.state() + faker.location.city(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		age: faker.number.int({
			min: 18,
			max: 60
		}),
		createDate: faker.date.past().toISOString().slice(0, 10)
	};
}
// mock/shared/utils.ts
function array(length) {
	return new Array(length).fill(0);
}
/**
*
* @param pageCurrent 当前页码
* @param pageSize 分页展示条数
* @param array 数据
*
* mock 分页展示数据
*/
function pagination(pageCurrent, pageSize, array) {
	const offset = (pageCurrent - 1) * Number(pageSize);
	return offset + Number(pageSize) >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + Number(pageSize));
}
/**
*
* @param value 原始数据
*
* 格式化数据为 json 格式
*/
function stringify(value) {
	return JSON.stringify(value);
}
/**
*
* @param res 数据
* @param code 响应码
* @param msg 响应信息
*/
function response(res, code, msg, params) {
	return {
		code,
		msg,
		data: res,
		...params
	};
}
// mock/demo/person.mock.ts
var person_mock_exports = /* @__PURE__ */ __exportAll({ getPersonList: () => getPersonList });
const getPersonList = defineMock({
	url: "/api/list",
	method: "GET",
	delay: 500,
	response: (req, res) => {
		const { query: { page, pageSize, email } } = req;
		let list = array(100).map(() => tableMock());
		let length = list.length;
		if (!page || !pageSize) res.end(stringify(response(list, 200, "请求成功", { total: length })));
		else {
			list = pagination(page, pageSize, list);
			if (email) {
				list = list.filter((curr) => curr.email.includes(email));
				length = list.length;
			}
			res.end(stringify(response(list, 200, "请求成功", { total: length })));
		}
	}
});
// mock-data-1793689420684.js
const mockList = [[person_mock_exports, "mock/demo/person.mock.ts"]].map(([mod, filepath]) => processRawData(mod.default || mod, filepath));
var mock_data_1793689420684_default = processMockData(mockList);
export { mock_data_1793689420684_default as default };
