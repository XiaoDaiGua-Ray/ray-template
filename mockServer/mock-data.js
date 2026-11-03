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
// src/demo-data/people.ts
let people;
const listPeople = ({ page, pageSize, email, name, sortAge } = {}) => {
	people ??= Array.from({ length: 100 }, () => ({
		id: faker.string.uuid(),
		address: faker.location.state() + faker.location.city(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		age: faker.number.int({
			min: 18,
			max: 60
		}),
		createDate: faker.date.past().toISOString().slice(0, 10)
	}));
	const emailQuery = email?.trim().toLowerCase();
	const nameQuery = name?.trim().toLowerCase();
	const matches = people.filter((person) => (!emailQuery || person.email.toLowerCase().includes(emailQuery)) && (!nameQuery || person.name.toLowerCase().includes(nameQuery)));
	if (sortAge) {
		const direction = sortAge === "ascend" ? 1 : -1;
		matches.sort((left, right) => direction * (left.age - right.age));
	}
	const validPage = page !== void 0 && Number.isSafeInteger(page) && page > 0;
	const validSize = pageSize !== void 0 && Number.isSafeInteger(pageSize) && pageSize > 0;
	const start = validPage && validSize ? (page - 1) * pageSize : 0;
	return {
		code: 200,
		msg: "请求成功",
		data: validPage && validSize ? matches.slice(start, start + pageSize) : matches,
		total: matches.length
	};
};
// mock/demo/person.mock.ts
var person_mock_exports = /* @__PURE__ */ __exportAll({ default: () => person_mock_default });
var person_mock_default = defineMock({
	url: "/api/list",
	method: "GET",
	delay: 250,
	body: ({ query }) => listPeople({
		page: Number(query.page),
		pageSize: Number(query.pageSize),
		email: typeof query.email === "string" ? query.email : void 0,
		name: typeof query.name === "string" ? query.name : void 0,
		sortAge: query.sortAge === "ascend" || query.sortAge === "descend" ? query.sortAge : void 0
	})
});
// mock-data-1793693290158.js
const mockList = [[person_mock_exports, "mock/demo/person.mock.ts"]].map(([mod, filepath]) => processRawData(mod.default || mod, filepath));
var mock_data_1793693290158_default = processMockData(mockList);
export { mock_data_1793693290158_default as default };
