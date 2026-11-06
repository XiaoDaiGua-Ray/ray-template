import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { getAdminOpenApi } from '@ray-template/api-contracts/openapi'
import { iconNames, retiredIcons } from '@ray-template/icons'
import { routeViewCatalog } from '../apps/admin/src/router/config/views.ts'
import {
  ACCOUNT_PROFILE_NAME,
  ACCOUNT_PROFILE_PATH,
  ROUTE_MANAGEMENT_PATH,
  SYSTEM_ROUTE_NAMES,
  SYSTEM_ROUTE_PATHS,
} from '../apps/admin/src/router/constant/index.ts'

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

const catalogFile = new URL(
  '../packages/demo-data/src/route-catalog.json',
  import.meta.url,
)
const catalogContent = `${JSON.stringify({ views: routeViewCatalog, managementPath: ROUTE_MANAGEMENT_PATH, reservedPaths: [...SYSTEM_ROUTE_PATHS, ACCOUNT_PROFILE_PATH], reservedNames: [...SYSTEM_ROUTE_NAMES, ACCOUNT_PROFILE_NAME, 'RLogin', 'RLayout', 'RNotFound', 'RouteManagement', 'RouteManagementVisual', 'ErrorPage', 'RayTemplateDoc'], icons: iconNames, iconAliases: Object.fromEntries(retiredIcons) }, null, 2)}\n`

if (process.argv.includes('--check')) {
  if (readFileSync(catalogFile, 'utf8') !== catalogContent)
    throw new Error('Route catalog is stale. Run pnpm api:generate.')
} else {
  writeFileSync(catalogFile, catalogContent)
}
