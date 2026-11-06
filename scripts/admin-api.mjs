import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { getAdminOpenApi } from '@ray-template/api-contracts/openapi'

const file = new URL(
  '../apps/admin/public/contracts/admin-api.json',
  import.meta.url,
)
const content = `${JSON.stringify(getAdminOpenApi(), null, 2)}\n`
const files = [
  file,
  new URL('../apps/docs/public/contracts/admin-api.json', import.meta.url),
]

if (process.argv.includes('--check')) {
  const worker = new URL(
    '../apps/admin/public/mockServiceWorker.js',
    import.meta.url,
  )

  if (
    readFileSync(worker, 'utf8') !==
    readFileSync(
      new URL(import.meta.resolve('msw/mockServiceWorker.js')),
      'utf8',
    )
  ) {
    throw new Error(
      'Mock worker is stale. Run pnpm exec msw init apps/admin/public --save.',
    )
  }

  if (files.some((target) => readFileSync(target, 'utf8') !== content)) {
    throw new Error('Admin API contract is stale. Run pnpm api:generate.')
  }

  console.log('Admin API contract matches the runtime schemas.')
} else {
  for (const target of files) {
    mkdirSync(new URL('.', target), { recursive: true })
    writeFileSync(target, content)
  }

  console.log('Generated Admin API contracts for the app and docs.')
}
