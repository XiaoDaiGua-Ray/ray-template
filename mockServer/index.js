import { createServer } from 'node:http';
import connect from 'connect';
import corsMiddleware from 'cors';
import { baseMiddleware, mockWebSocket } from 'vite-plugin-mock-dev-server';
import mockData from './mock-data.js';

const app = connect();
const server = createServer(app);
const httpProxies = ["^/api"];
const wsProxies = [];
const cookiesOptions = {};

mockWebSocket({ mockData }, server, wsProxies, cookiesOptions);

app.use(corsMiddleware());
app.use(baseMiddleware({ mockData }, {
  formidableOptions: { multiples: true },
  proxies: httpProxies,
  cookiesOptions,
}));

server.listen(8080);

console.log('listen: http://localhost:8080');
