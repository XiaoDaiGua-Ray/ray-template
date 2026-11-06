FROM node:26.13.0-bookworm-slim AS node-base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

FROM node-base AS workspace
WORKDIR /workspace
RUN npm install --global pnpm@12.16.1
COPY . .
RUN HUSKY=0 pnpm install --frozen-lockfile

FROM workspace AS server-build
RUN pnpm server:build
RUN pnpm --filter @ray-template/server deploy --legacy /server

FROM workspace AS admin-build
RUN VITE_API_MOCK=false VITE_API_BASE_URL=/api/ VITE_API_AUTH_TRANSPORT=cookie pnpm build

FROM node-base AS server
WORKDIR /app
COPY --from=server-build --chown=node:node /server .
USER node
EXPOSE 3000
CMD ["node", "dist/main.mjs"]

FROM nginx:stable-alpine AS admin
COPY --from=admin-build /workspace/dist/production /usr/share/nginx/html/ray-template
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
