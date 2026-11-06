import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import { defineConfig } from 'prisma/config'

const envFile = new URL('.env.local', import.meta.url)

if (existsSync(envFile)) loadEnvFile(envFile)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://127.0.0.1/ray_template',
  },
})
