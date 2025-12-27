import { useSiderBar } from '../../src/hooks/template/useSiderBar'
import { useVueRouter } from '../../src/hooks/web/useVueRouter'
import { useMenuActions, useMenuGetters } from '../../src/store'
import type { AppMenuOption, MenuTagOptions } from '../../src/types/modules/app'
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
    const [f, s] = getMenuOptions.value

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
})
