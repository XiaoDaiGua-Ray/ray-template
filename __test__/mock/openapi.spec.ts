import { getAdminOpenApi } from '@ray-template/api-contracts/openapi'

it('keeps every generated schema reference resolvable from the OpenAPI document', () => {
  const document = getAdminOpenApi()
  const refs: string[] = []
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') return

    for (const [key, child] of Object.entries(value)) {
      if (key === '$ref') refs.push(String(child))
      else visit(child)
    }
  }

  visit(document)
  expect(refs.some((ref) => ref.includes('/RouteConfig/$defs/'))).toBe(true)

  for (const ref of refs) {
    expect(ref).toMatch(/^#\//)
    const target = ref
      .slice(2)
      .split('/')
      .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
      .reduce<unknown>(
        (value, key) =>
          value && typeof value === 'object'
            ? (value as Record<string, unknown>)[key]
            : void 0,
        document,
      )

    expect(target, ref).toBeDefined()
  }

  expect(document.components.schemas.RouteConfig.$schema).toBe(
    'https://json-schema.org/draft/2020-12/schema',
  )
})

it('documents the actual demo inputs and backend-independent response fields', () => {
  const document = getAdminOpenApi()
  const people = document.paths['/admin/demo/people'].get.parameters
  const charts = document.paths['/admin/demo/charts'].get.parameters

  expect(people.map(({ name }) => name)).toEqual(
    expect.arrayContaining([
      'page',
      'pageSize',
      'name',
      'email',
      'sortAge',
      'fail',
    ]),
  )
  expect(people.find(({ name }) => name === 'pageSize')?.schema).toMatchObject({
    type: 'integer',
    maximum: 100,
  })
  expect(charts.find(({ name }) => name === 'refresh')?.schema).toMatchObject({
    type: 'boolean',
  })
  expect(
    document.paths['/admin/demo/search-options'].get.parameters[0].name,
  ).toBe('locale')
  expect(
    document.paths['/admin/demo/route-people/{id}'].parameters[0].schema,
  ).toEqual({ type: 'integer', minimum: 0 })
  expect(
    document.components.schemas.DemoOrderQuery.properties?.query,
  ).toMatchObject({
    properties: {
      minAmount: {
        anyOf: expect.arrayContaining([{ type: 'number', minimum: 0 }]),
      },
    },
  })
})
