import { useBadge } from '../../src/hooks/template/useBadge'
import type { AppMenuExtraOptions } from '../../src/router/types'
import { useMenuGetters } from '../../src/store'
import setupMiniApp from '../utils/setupMiniApp'

describe('useBadge', async () => {
  await setupMiniApp()

  const { show, hidden, update } = useBadge()
  const { getMenuOptions } = useMenuGetters()

  const baseBadge = (extra: AppMenuExtraOptions) =>
    Object.assign(
      {},
      {
        label: 'new',
        type: 'error',
      } as AppMenuExtraOptions,
      extra,
    )

  it('should hide badge', () => {
    const [dashboard] = getMenuOptions.value

    update(
      dashboard,
      baseBadge({
        show: false,
        label: 'new',
      }),
    )
    hidden(dashboard)

    expect(dashboard.meta.extra?.show).toBe(false)
  })

  it('should show badge', () => {
    const [dashboard] = getMenuOptions.value

    update(
      dashboard,
      baseBadge({
        show: true,
        label: 'new',
      }),
    )
    show(dashboard)

    expect(dashboard.meta.extra?.show).toBe(true)
  })

  it('should show badge with new label', () => {
    const [dashboard] = getMenuOptions.value
    const label = 'update new'

    update(
      dashboard,
      baseBadge({
        show: true,
        label,
      }),
    )

    expect(dashboard.meta.extra?.label).toBe(label)
  })
  it('preserves explicit visibility when updating only the label', () => {
    const [dashboard] = getMenuOptions.value

    hidden(dashboard)
    update(dashboard, { label: 'Changed while hidden' })
    expect(dashboard.meta.extra?.show).toBe(false)
    show(dashboard)
    update(dashboard, { label: 'Changed while visible' })
    expect(dashboard.meta.extra?.show).toBe(true)
  })
})
