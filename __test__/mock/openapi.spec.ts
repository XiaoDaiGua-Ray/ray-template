import { getAdminOpenApi } from '@/api/admin/openapi'

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
