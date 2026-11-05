import { useAppRoot } from '../../apps/admin/src/hooks/template/useAppRoot'
import { useSiderBar } from '../../apps/admin/src/hooks/template/useSiderBar'
import { useVueRouter } from '../../apps/admin/src/hooks/web/useVueRouter'
import { firstMenuLeaf } from '../../apps/admin/src/layout/navigation'
import { useMenuActions, useMenuGetters } from '../../apps/admin/src/store'
import type {
  AppMenuOption,
  MenuTagOptions,
} from '../../apps/admin/src/types/modules/app'
import setupMiniApp from '../utils/setupMiniApp'

describe('useSiderBar', async () => {
  await setupMiniApp()

  const { setMenuTagOptions, resolveOption } = useMenuActions()
  const {
    close,
    closeAll,
    closeRight,
    closeLeft,
    closeOther,
    getCurrentTagIndex,
    checkCloseRight,
    checkCloseLeft,
  } = useSiderBar()

  const updateMenuTagOptions = () => {
    const { router } = useVueRouter()
    const routes = router.getRoutes() as unknown as AppMenuOption[]

    routes.forEach((curr) =>
      setMenuTagOptions(
        resolveOption({
          ...curr,
          fullPath: curr.path,
        }),
        true,
      ),
    )
  }

  it('should close target tag', async () => {
    updateMenuTagOptions()

    const { getMenuOptions, getMenuTagOptions } = useMenuGetters()
    const [dashboard] = getMenuOptions.value
    const beforeIndex = getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === dashboard.fullPath,
    )

    close(dashboard.fullPath)

    await nextTick()

    const afterIndex = getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === dashboard.fullPath,
    )

    expect(beforeIndex).not.toBe(afterIndex)
  })

  it('should close all tags', async () => {
    updateMenuTagOptions()

    const { getMenuTagOptions } = useMenuGetters()

    closeAll()

    await nextTick()

    const afterLength = getMenuTagOptions.value.length

    expect(afterLength).toBe(1)
  })

  it('should close right tags', async () => {
    updateMenuTagOptions()

    const { getMenuOptions, getMenuTagOptions } = useMenuGetters()
    const [dashboard] = getMenuOptions.value
    const beforeIndex = getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === dashboard.fullPath,
    )

    expect(!!getMenuTagOptions.value[beforeIndex + 1]).toBe(true)

    closeRight(dashboard.fullPath)

    await nextTick()

    const afterIndex = getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === dashboard.fullPath,
    )

    expect(getMenuTagOptions.value[afterIndex + 1]).toBe(void 0)
  })

  it('should close left tags', async () => {
    updateMenuTagOptions()

    const { getMenuOptions, getMenuTagOptions } = useMenuGetters()
    const [dashboard] = getMenuOptions.value

    closeLeft(dashboard.fullPath)

    await nextTick()

    const afterIndex = getMenuTagOptions.value.findIndex(
      (curr) => curr.fullPath === dashboard.fullPath,
    )

    expect(getMenuTagOptions.value[afterIndex - 1]).toBe(void 0)
  })

  it('should get current tag index', async () => {
    updateMenuTagOptions()

    const { getMenuOptions, getMenuTagOptions } = useMenuGetters()
    const [dashboard] = getMenuOptions.value

    const index = getMenuOptions.value.findIndex(
      (curr) => curr.fullPath === dashboard.fullPath,
    )

    expect(getCurrentTagIndex()).toBe(index)
  })

  it('should close other tags', async () => {
    updateMenuTagOptions()

    const { getMenuOptions, getMenuTagOptions } = useMenuGetters()
    const [dashboard] = getMenuOptions.value

    closeOther(dashboard.fullPath)

    await nextTick()

    expect(getMenuTagOptions.value[0].fullPath).toBe(dashboard.fullPath)
    expect(getMenuTagOptions.value.length).toBe(1)
  })

  it('check menuTagOptions left or right can close', async () => {
    updateMenuTagOptions()

    const { getMenuOptions, getMenuTagOptions } = useMenuGetters()
    const [f, group] = getMenuOptions.value
    const s = firstMenuLeaf(group)!

    closeRight(f.fullPath)

    await nextTick()

    const canClose = checkCloseRight(f.fullPath)

    expect(canClose).toBe(false)

    updateMenuTagOptions()

    closeLeft(f.fullPath)

    await nextTick()

    const canCloseLeft = checkCloseLeft(f.fullPath)

    expect(canCloseLeft).toBe(false)

    updateMenuTagOptions()

    expect(checkCloseRight(s.fullPath)).toBe(true)
    expect(checkCloseLeft(s.fullPath)).toBe(true)
  })
  it('keeps existing tags if the configured home route is no longer registered', () => {
    updateMenuTagOptions()
    const { getMenuTagOptions } = useMenuGetters()
    const { getRootRoute, setRootRoute } = useAppRoot()
    const currentRoot = { ...getRootRoute.value }
    const currentTags = getMenuTagOptions.value.map((item) => item.fullPath)

    try {
      setRootRoute({ path: '/deleted-home-route' })
      closeAll()
      expect(getMenuTagOptions.value.map((item) => item.fullPath)).toEqual(
        currentTags,
      )
    } finally {
      setRootRoute(currentRoot)
    }
  })
})
