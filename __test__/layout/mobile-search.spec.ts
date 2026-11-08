import { flushPromises, mount } from '@vue/test-utils'
import GlobalSearch from '../../apps/admin/src/layout/components/Search/GlobalSearch'
import { router } from '../../apps/admin/src/router'
import { piniaMenuStore } from '../../apps/admin/src/store/modules/menu'
import setupMiniApp from '../utils/setupMiniApp'

it('keeps page search available on phones and lets a search result close the dialog', async () => {
  vi.stubGlobal('innerWidth', 390)
  const { app } = await setupMiniApp()
  const menu = piniaMenuStore()

  menu.options = [
    {
      path: '/visible',
      fullPath: '/visible',
      key: '/visible',
      name: 'visible',
      breadcrumbLabel: 'Visible page',
      label: 'Visible page',
      meta: {},
    },
  ]
  const navigate = vi
    .spyOn(menu, 'changeMenuModelValue')
    .mockImplementation(() => void 0)
  const wrapper = mount(GlobalSearch, {
    attachTo: document.body,
    props: { show: true },
    global: {
      plugins: [router],
      stubs: {
        teleport: true,
        RIcon: { inheritAttrs: false, template: '<span />' },
      },
    },
  })

  try {
    await flushPromises()
    expect(wrapper.emitted('update:show')).toBeUndefined()
    expect(wrapper.find('.global-search').exists()).toBe(true)
    await wrapper.get('input').setValue('Visible')
    await flushPromises()
    expect(wrapper.findAll('.global-search__destination')).toHaveLength(1)

    vi.stubGlobal('innerWidth', 1440)
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    expect(wrapper.emitted('update:show')).toBeUndefined()
    expect(wrapper.get('input').element.value).toBe('Visible')

    await wrapper.get('.global-search__destination').trigger('click')
    await flushPromises()
    expect(navigate).toHaveBeenCalledWith(
      '/visible',
      expect.objectContaining({ fullPath: '/visible' }),
    )
    expect(wrapper.emitted('update:show')).toContainEqual([false])
  } finally {
    wrapper.unmount()
    app.unmount()
    vi.unstubAllGlobals()
  }
})
