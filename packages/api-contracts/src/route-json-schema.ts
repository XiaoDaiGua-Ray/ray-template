import { toJsonSchema } from '@valibot/to-json-schema'
import { routeConfigSchema, routeRecordSchema } from './routes.ts'

export const getRouteJsonSchema = () =>
  toJsonSchema(routeConfigSchema, {
    target: 'draft-2020-12',
    definitions: { route: routeRecordSchema },
    ignoreActions: ['check', 'finite'],
  })
