import { useBadge } from '../../src/hooks/template/useBadge'
import type { AppMenuExtraOptions } from '../../src/router/types'
import { depthSearchAppMenu, useMenuGetters } from '../../src/store'
import type { AppMenuOption } from '../../src/types'
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
  it('updates the badge of a nested menu item by path', () => {
    const parent = getMenuOptions.value.find((item) => item.children?.length)
    const leaf = parent?.children?.[0]

    expect(leaf).toBeDefined()

    if (!leaf) return

    const previous = leaf.meta.extra

    show(leaf.fullPath, { label: 'Nested badge' })
    expect(leaf.meta.extra).toMatchObject({ label: 'Nested badge', show: true })
    update(leaf, { show: previous?.show ?? false, label: previous?.label })
  })
})

it('finds nested menu items in the supplied tree instead of returning a stale cached match', () => {
  const item = (path: string) => ({
    name: path,
    label: path,
    key: path,
    fullPath: path,
    path,
    meta: {},
  })
  const first = item('/nested')
  const second = item('/nested')
  const tree = (leaf: AppMenuOption) => [
    { ...item('/branch'), children: [leaf] },
    { ...item('/later'), children: [item('/nested')] },
  ]

  expect(depthSearchAppMenu(tree(first), '/nested?query=yes')).toBe(first)
  expect(depthSearchAppMenu(tree(second), '/nested')).toBe(second)
  expect(depthSearchAppMenu(tree(second), '/missing')).toBeUndefined()
})
