// mock-data-1766828655390.js
import { processMockData, processRawData } from "vite-plugin-mock-dev-server/server";
var exporters = [];
var mockList = exporters.map(([mod, filepath]) => processRawData(mod.default || mod, filepath));
var mock_data_1766828655390_default = processMockData(mockList);
export {
  mock_data_1766828655390_default as default
};
