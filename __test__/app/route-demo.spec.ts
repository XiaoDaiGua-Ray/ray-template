import * as demoApi from '@/api/demo/data'
import RouteDemoDetail from '@/views/demo/router-demo/router-demo-detail'
import type { RouteDemoPerson } from '@ray-template/api-contracts/demo'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

const person = (key: number): RouteDemoPerson => ({
  key,
  name: `Remote person ${key}`,
  address: 'Remote address',
  phone: '123456',
})
const createDetailRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/details', component: RouteDemoDetail }],
  })

afterEach(() => vi.restoreAllMocks())

it('cancels the previous detail request and ignores its late response after navigation', async () => {
  const pending = new Map<
    string,
    { resolve: (value: RouteDemoPerson) => void; signal?: AbortSignal }
  >()

  vi.spyOn(demoApi, 'getRouteDemoPerson').mockImplementation(
    (id, signal) =>
      new Promise((resolve) => pending.set(id, { resolve, signal })),
  )
  const router = createDetailRouter()

  await router.push('/details?id=0')
  const wrapper = mount(RouteDemoDetail, { global: { plugins: [router] } })

  try {
    await flushPromises()
    await router.push('/details?id=1')
    await flushPromises()
    expect(pending.get('0')?.signal?.aborted).toBe(true)
    pending.get('1')!.resolve(person(1))
    await flushPromises()
    pending.get('0')!.resolve(person(0))
    await flushPromises()
    expect(wrapper.text()).toContain('Remote person 1')
    expect(wrapper.text()).not.toContain('Remote person 0')
  } finally {
    wrapper.unmount()
  }
})

it('retries a failed detail request without showing a local sample record', async () => {
  const lookup = vi
    .spyOn(demoApi, 'getRouteDemoPerson')
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(person(2))
  const router = createDetailRouter()

  await router.push('/details?id=2')
  const wrapper = mount(RouteDemoDetail, { global: { plugins: [router] } })

  try {
    await flushPromises()
    expect(wrapper.text()).not.toContain('Remote person 2')
    const retry = wrapper
      .findAll('button')
      .find((button) => /重试|Retry|retry/.test(button.text()))

    expect(retry).toBeDefined()
    await retry!.trigger('click')
    await flushPromises()
    expect(lookup).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('Remote person 2')
  } finally {
    wrapper.unmount()
  }
})
