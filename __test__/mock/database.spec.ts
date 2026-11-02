import { tableMock } from '../../mock/shared/database'

describe('tableMock', () => {
  it('preserves the person response fields after the data generator upgrade', () => {
    const person = tableMock({ source: 'demo' })

    expect(person).toMatchObject({
      source: 'demo',
      id: expect.any(String),
      address: expect.any(String),
      email: expect.any(String),
      name: expect.any(String),
      age: expect.any(Number),
      createDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    })
    expect(person.id).toMatch(/^[0-9a-f-]{36}$/i)
    expect(person.age).toBeGreaterThanOrEqual(18)
    expect(person.age).toBeLessThanOrEqual(60)
    expect(person.email).toContain('@')
  })
})
