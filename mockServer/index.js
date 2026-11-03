import { createServer } from 'node:http';
import process from 'node:process';
import connect from 'connect';
import { createMockMiddleware, createLogger, createMatchingWeightSorter, mockWebSocket } from 'vite-plugin-mock-dev-server/server';
import mockData from './mock-data.js';

const app = connect();
const server = createServer(app);
const logger = createLogger('mock-server', "error");
const proxies = ["/api","^/api"];
const wsProxies = [];
const cookiesOptions = {};
const bodyParserOptions = {};
const priority = {};
const cors = {};
const activeScene = [];
const formidableOptions = {"multiples":true};
const record = {
  enabled: false,
  cwd: process.cwd(),
  dir: "mock/.recordings",
  expires: Number.MAX_SAFE_INTEGER,
  status: [],
};

const compiler = { mockData }
const sortMockUrls = createMatchingWeightSorter()

mockWebSocket(compiler, server, { wsProxies, cookiesOptions, logger, activeScene, priority });

app.use(createMockMiddleware(compiler, {
  formidableOptions,
  proxies,
  priority,
  cookiesOptions,
  bodyParserOptions,
  logger,
  cors,
  record,
  replay: false,
  activeScene,
}, sortMockUrls));

const envPort = Number(process.env.PORT);
const port = Number.isInteger(envPort) && envPort > 0 ? envPort : 8080;
const host = process.env.HOST || undefined;

server.on('error', (error) => {
  logger.error(`Failed to start the mock server on ${host ?? '0.0.0.0'}:${port}: ${error}`);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`listen: http://${host ?? 'localhost'}:${port}`);
});
