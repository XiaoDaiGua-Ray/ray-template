import { AdminShell } from '@ray-template/admin-shell'
import { RIcon } from '@ray-template/ui/icon'
import { RTablePro } from '@ray-template/ui/table-pro'
import { mount } from '@vue/test-utils'

it('mounts the shared shell, icons and table using only public package entries', async () => {
  const wrapper = mount(AdminShell, {
    props: {
      layout: {
        mode: 'right',
        contentWidth: 'fluid',
        contentMaxWidth: 1200,
        contentPadding: 16,
        fixedHeader: true,
        fixedFooter: true,
      },
    },
    slots: {
      sidebar: () => <RIcon name="action/search" />,
      default: () => (
        <RTablePro
          bare
          columns={[{ key: 'name', title: 'Name' }]}
          data={[{ id: 1, name: 'Workspace consumer' }]}
        />
      ),
    },
  })

  try {
    await vi.waitFor(() => {
      expect(
        wrapper.get('.r-icon svg').element.childElementCount,
      ).toBeGreaterThan(0)
    })
    expect(wrapper.text()).toContain('Workspace consumer')
  } finally {
    wrapper.unmount()
  }
})
