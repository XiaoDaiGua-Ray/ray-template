import { request } from '@/axios'

interface RequestFixture {
  ticket: { id: string; title: string; status: string }
  cities: Record<string, { temperature: number; humidity: number }>
}

export const requestFixtureUrl = `${import.meta.env.BASE_URL}examples/request.json`

export const getRequestFixture = () =>
  request<RequestFixture>({ url: requestFixtureUrl, method: 'get' })

export const getWeather = async (city: string) => {
  const { cities } = await getRequestFixture()
  const weather = cities[city]

  if (!weather) throw new Error('Missing sample city.')

  return { city, ...weather }
}
