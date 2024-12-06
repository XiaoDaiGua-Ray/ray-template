import { createServer } from 'node:http';
import connect from 'connect';
import corsMiddleware from 'cors';
import { baseMiddleware, createLogger, mockWebSocket } from 'vite-plugin-mock-dev-server/server';
import mockData from './mock-data.js';

const app = connect();
const server = createServer(app);
const logger = createLogger('mock-server', 'error');
const proxies = ["^/api"];
const wsProxies = [];
const cookiesOptions = {};
const bodyParserOptions = {};
const priority = {};
const compiler = { mockData }

mockWebSocket(compiler, server, { wsProxies, cookiesOptions, logger });

app.use(corsMiddleware());
app.use(baseMiddleware(compiler, {
  formidableOptions: { multiples: true },
  proxies,
  priority,
  cookiesOptions,
  bodyParserOptions,
  logger,
}));

server.listen(8080);

console.log('listen: http://localhost:8080');
