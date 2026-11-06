import { toJsonSchema } from '@valibot/to-json-schema'
import * as v from 'valibot'
import {
  accountProfileSchema,
  browserLoginResultSchema,
  changedSchema,
  changePasswordSchema,
  credentialInputSchema,
  envelopeSchema,
  idsSchema,
  loginInputSchema,
  loginResultSchema,
  profileInputSchema,
  sessionSchema,
  statusInputSchema,
  userInputSchema,
  userListQuerySchema,
  userListSchema,
  userOptionsSchema,
  userSchema,
} from './admin.ts'
import {
  chartsQuerySchema,
  chartsSchema,
  orderSearchInputSchema,
  ordersResultSchema,
  ownerOptionsSchema,
  ownerSearchInputSchema,
  peopleResultSchema,
  personListQuerySchema,
  requestFixtureSchema,
  routeDemoPersonSchema,
  routePeopleQuerySchema,
  routePeopleResultSchema,
  searchOptionsQuerySchema,
  searchOptionsSchema,
} from './demo.ts'
import { routeConfigSchema } from './routes.ts'

export function getAdminOpenApi() {
  const schemas = Object.fromEntries(
    Object.entries({
      UserInput: userInputSchema,
      User: userSchema,
      UserList: userListSchema,
      UserListQuery: userListQuerySchema,
      UserOptions: userOptionsSchema,
      LoginInput: loginInputSchema,
      LoginResult: loginResultSchema,
      BrowserLoginResult: browserLoginResultSchema,
      Session: sessionSchema,
      AccountProfile: accountProfileSchema,
      ProfileInput: profileInputSchema,
      ChangePassword: changePasswordSchema,
      CredentialInput: credentialInputSchema,
      Ids: idsSchema,
      StatusInput: statusInputSchema,
      Changed: changedSchema,
      RouteConfig: routeConfigSchema,
      DemoCharts: chartsSchema,
      DemoPeople: peopleResultSchema,
      DemoRequest: requestFixtureSchema,
      DemoOrders: ordersResultSchema,
      DemoOwners: ownerOptionsSchema,
      DemoOrderQuery: orderSearchInputSchema,
      DemoOwnerQuery: ownerSearchInputSchema,
      DemoPeopleQuery: personListQuerySchema,
      DemoChartsQuery: chartsQuerySchema,
      DemoSearchOptionsQuery: searchOptionsQuerySchema,
      DemoSearchOptions: searchOptionsSchema,
      DemoRoutePerson: routeDemoPersonSchema,
      DemoRoutePeopleQuery: routePeopleQuerySchema,
      DemoRoutePeople: routePeopleResultSchema,
      Error: v.object({ ...envelopeSchema.entries, data: v.null() }),
    }).map(([name, schema]) => [
      name,
      toJsonSchema(schema, {
        target: 'draft-2020-12',
        errorMode: 'ignore',
        // Schema 嵌入 OpenAPI 后，递归引用必须从整个文档定位到所属组件。
        overrideRef: ({ referenceId }) =>
          `#/components/schemas/${name}/$defs/${referenceId.replaceAll('~', '~0').replaceAll('/', '~1')}`,
      }),
    ]),
  )
  const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` })
  const queryParameters = (name: string) =>
    Object.entries(schemas[name].properties ?? {}).map(([key, schema]) => ({
      name: key,
      in: 'query',
      required: schemas[name].required?.includes(key) ?? false,
      schema,
    }))
  const json = (schema: unknown) => ({ 'application/json': { schema } })
  const operation = (
    id: string,
    result: string | null | string[],
    permission?: string,
    input?: string,
    publicEndpoint = false,
  ) => ({
    operationId: id,
    summary: id,
    description: permission
      ? `Required permission: ${permission}.`
      : publicEndpoint
        ? 'Public endpoint.'
        : 'Requires an active session.',
    security: publicEndpoint
      ? []
      : [{ bearerAuth: [] }, { browserSession: [] }],
    ...(input
      ? { requestBody: { required: true, content: json(ref(input)) } }
      : {}),
    responses: {
      '200': {
        description: 'Success',
        content: json({
          type: 'object',
          required: ['code', 'msg', 'data'],
          properties: {
            code: { const: 200 },
            msg: { type: 'string' },
            data: Array.isArray(result)
              ? { anyOf: result.map(ref) }
              : result
                ? ref(result)
                : { type: 'null' },
          },
        }),
      },
      ...Object.fromEntries(
        [400, 401, 403, 404, 409, 413, 429, 503].map((status) => [
          status,
          {
            description: 'See error.key for a stable machine-readable reason.',
            content: json(ref('Error')),
          },
        ]),
      ),
    },
  })
  const pathId = {
    name: 'id',
    in: 'path',
    required: true,
    schema: { type: 'string' },
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'Ray Admin API',
      version: '1.1.0',
      description:
        'Mock and real backends share this contract. Route component values are identifiers from the frontend view catalog, never executable code.',
    },
    servers: [
      {
        url: '/ray-template/api',
        description:
          'Default demo base. Replace with VITE_API_BASE_URL for your backend.',
      },
    ],
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' },
        browserSession: {
          type: 'apiKey',
          in: 'cookie',
          name: '__Host-ray-session',
          description:
            'Bundled server only. Send X-Ray-Session: cookie on same-origin requests. Loopback HTTP uses ray-session.',
        },
      },
    },
    paths: {
      '/admin/demo/people': {
        get: {
          ...operation('getDemoPeople', 'DemoPeople', void 0, void 0, true),
          parameters: queryParameters('DemoPeopleQuery'),
        },
      },
      '/admin/demo/route-people': {
        get: {
          ...operation(
            'getRouteDemoPeople',
            'DemoRoutePeople',
            void 0,
            void 0,
            true,
          ),
          parameters: queryParameters('DemoRoutePeopleQuery'),
        },
      },
      '/admin/demo/route-people/{id}': {
        parameters: [{ ...pathId, schema: { type: 'integer', minimum: 0 } }],
        get: operation(
          'getRouteDemoPerson',
          'DemoRoutePerson',
          void 0,
          void 0,
          true,
        ),
      },
      '/admin/demo/search-options': {
        get: {
          ...operation(
            'getSearchOptions',
            'DemoSearchOptions',
            void 0,
            void 0,
            true,
          ),
          parameters: queryParameters('DemoSearchOptionsQuery'),
        },
      },
      '/admin/demo/request': {
        get: operation(
          'getRequestFixture',
          'DemoRequest',
          void 0,
          void 0,
          true,
        ),
      },
      '/admin/demo/charts': {
        get: {
          ...operation('getDemoCharts', 'DemoCharts', void 0, void 0, true),
          parameters: queryParameters('DemoChartsQuery'),
        },
      },
      '/admin/demo/orders/search': {
        post: operation(
          'searchDemoOrders',
          'DemoOrders',
          void 0,
          'DemoOrderQuery',
          true,
        ),
      },
      '/admin/demo/owners/search': {
        post: operation(
          'searchDemoOwners',
          'DemoOwners',
          void 0,
          'DemoOwnerQuery',
          true,
        ),
      },
      '/admin/auth/login': {
        post: {
          ...operation(
            'login',
            ['LoginResult', 'BrowserLoginResult'],
            void 0,
            'LoginInput',
            true,
          ),
          description:
            'Returns a Bearer token by default. The bundled server omits it and sets an HttpOnly cookie when X-Ray-Session is cookie.',
          parameters: [
            {
              name: 'X-Ray-Session',
              in: 'header',
              schema: { const: 'cookie' },
            },
          ],
        },
      },
      '/admin/auth/session': { get: operation('getSession', 'Session') },
      '/admin/auth/logout': { post: operation('logout', null) },
      '/admin/auth/profile': {
        get: operation('getProfile', 'AccountProfile'),
        patch: operation(
          'updateProfile',
          'AccountProfile',
          void 0,
          'ProfileInput',
        ),
      },
      '/admin/auth/password': {
        patch: operation('changePassword', null, void 0, 'ChangePassword'),
      },
      '/admin/route-config': {
        get: {
          ...operation('getRouteConfig', 'RouteConfig'),
          description:
            'Authorized navigation snapshot for the current session; returns an empty routes array without routes:read. Request view=editor with routes:write to read the complete saved configuration.',
          parameters: [
            {
              name: 'view',
              in: 'query',
              required: false,
              schema: { const: 'editor' },
            },
          ],
        },
        put: operation(
          'updateRouteConfig',
          'RouteConfig',
          'routes:write',
          'RouteConfig',
        ),
      },
      '/admin/users/options': {
        get: operation('getUserOptions', 'UserOptions', 'users:read'),
      },
      '/admin/users/{id}/credential': {
        parameters: [pathId],
        put: operation(
          'setUserCredential',
          null,
          'users:credentials',
          'CredentialInput',
        ),
      },
      '/admin/users': {
        get: {
          ...operation('listUsers', 'UserList', 'users:read'),
          parameters: queryParameters('UserListQuery'),
        },
        post: operation('createUser', 'User', 'users:create', 'UserInput'),
      },
      '/admin/users/{id}': {
        parameters: [pathId],
        get: operation('getUser', 'User', 'users:read'),
        put: operation('updateUser', 'User', 'users:update', 'UserInput'),
      },
      '/admin/users/batch-delete': {
        post: operation('deleteUsers', 'Changed', 'users:delete', 'Ids'),
      },
      '/admin/users/status': {
        patch: operation(
          'updateUserStatus',
          'Changed',
          'users:status',
          'StatusInput',
        ),
      },
      '/admin/users/reset': {
        post: operation('resetDemoUsers', 'Changed', 'users:reset'),
      },
    },
  }
}
