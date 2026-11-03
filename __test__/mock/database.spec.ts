import { listPeople } from '@/demo-data/people'

describe('person demo data', () => {
  it('serves consistent, non-overlapping pages with the documented record shape', () => {
    const first = listPeople({ page: 1, pageSize: 10 })
    const second = listPeople({ page: 2, pageSize: 10 })

    expect(first.total).toBe(100)
    expect(second.total).toBe(100)
    expect(first.data).toHaveLength(10)
    expect(second.data).toHaveLength(10)
    expect(first.data[0]).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f-]{36}$/i),
      name: expect.any(String),
      email: expect.stringContaining('@'),
      address: expect.any(String),
      age: expect.any(Number),
      createDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    })
    expect(
      new Set([...first.data, ...second.data].map(({ id }) => id)).size,
    ).toBe(20)
    expect(listPeople({ page: 1, pageSize: 10 })).toEqual(first)
  })

  it('filters all rows before paginating and reports the filtered total', () => {
    const { data } = listPeople()
    const person = data.at(-1)!
    const email = person.email.toUpperCase()
    const matches = data.filter((row) => row.email === person.email)

    expect(listPeople({ email, page: 1, pageSize: 1 })).toMatchObject({
      data: matches.slice(0, 1),
      total: matches.length,
    })
    expect(
      listPeople({ email: 'no such email', page: 1, pageSize: 10 }),
    ).toMatchObject({
      data: [],
      total: 0,
    })
  })
})

it('sorts the complete filtered data before splitting into pages', () => {
  const first = listPeople({ page: 1, pageSize: 10, sortAge: 'descend' })
  const second = listPeople({ page: 2, pageSize: 10, sortAge: 'descend' })
  const ages = [...first.data, ...second.data].map(({ age }) => age)

  expect(ages).toEqual([...ages].sort((a, b) => b - a))
  expect(first.total).toBe(100)
})
