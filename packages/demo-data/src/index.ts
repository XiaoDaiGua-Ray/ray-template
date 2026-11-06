import { createRouteParser } from '@ray-template/api-contracts/route-validation'
import routeCatalog from './route-catalog.json' with { type: 'json' }
import routes from './routes.json' with { type: 'json' }

const views = new Map(routeCatalog.views.map((view) => [view.id, view]))
const icons = new Set(routeCatalog.icons)
const aliases: Record<string, string> = routeCatalog.iconAliases

export const parseApplicationRoutes = createRouteParser({
  ...routeCatalog,
  findRouteView: (id) => views.get(id),
  isIconName: (name) => icons.has(name),
  normalizeIcon: (name) => aliases[name] ?? name,
})

export const initialRoutes = parseApplicationRoutes(JSON.stringify(routes))
export { default as charts } from './charts.json' with { type: 'json' }
export { default as requestFixture } from './request.json' with { type: 'json' }
export * from './users.ts'
export * from './orders.ts'
export * from './people.ts'
export * from './route-people.ts'
export * from './queries.ts'
