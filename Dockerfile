FROM node:26.13.0-bookworm-slim
WORKDIR /app
RUN npm install --global pnpm@12.16.1
COPY . .
RUN HUSKY=0 pnpm install --frozen-lockfile
EXPOSE 9527
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
