import { adminRequest, apiUrl } from '@/api/admin/client'
import { requestFixtureSchema } from './data'

interface RequestFixture {
  ticket: { id: string; title: string; status: string }
  cities: Record<string, { temperature: number; humidity: number }>
}

export const requestFixtureUrl = apiUrl('admin/demo/request')

export const getRequestFixture = () =>
  adminRequest('demo/request', requestFixtureSchema, { method: 'get' })

export const getWeather = async (city: string) => {
  const { cities } = await getRequestFixture()
  const weather = cities[city]

  if (!weather) throw new Error('Missing sample city.')

  return { city, ...weather }
}
