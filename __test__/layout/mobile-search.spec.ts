import { mount } from '@vue/test-utils'
import GlobalSearch from '../../src/layout/components/Search/GlobalSearch'
import { router } from '../../src/router'
import setupMiniApp from '../utils/setupMiniApp'

it('mounts the header search on a narrow viewport and closes it immediately', async () => {
  vi.stubGlobal('innerWidth', 390)
  const { app } = await setupMiniApp()

  try {
    const wrapper = mount(GlobalSearch, {
      props: { show: true },
      global: { plugins: [router] },
    })

    expect(wrapper.emitted('update:show')).toContainEqual([false])
    expect(wrapper.find('.global-search').exists()).toBe(false)
    wrapper.unmount()
  } finally {
    app.unmount()
    vi.unstubAllGlobals()
  }
})
