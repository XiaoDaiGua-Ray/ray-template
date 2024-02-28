import { createServer } from 'node:http';
import connect from 'connect';
import corsMiddleware from 'cors';
import { baseMiddleware, createLogger, mockWebSocket } from 'vite-plugin-mock-dev-server';
import mockData from './mock-data.js';

const app = connect();
const server = createServer(app);
const logger = createLogger('mock-server', 'error');
const httpProxies = ["^/api"];
const wsProxies = [];
const cookiesOptions = {};
const priority = {};

mockWebSocket({ 
  loader: { mockData },
  httpServer: server,
  proxies: wsProxies,
  cookiesOptions,
  logger,
});

app.use(corsMiddleware());
app.use(baseMiddleware({ mockData }, {
  formidableOptions: { multiples: true },
  proxies: httpProxies,
  priority,
  cookiesOptions,
  logger,
}));

server.listen(8080);

console.log('listen: http://localhost:8080');
