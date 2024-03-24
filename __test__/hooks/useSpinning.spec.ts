import setupMiniApp from '../utils/setupMiniApp'
import { useSpinning } from '../../src/hooks/template/useSpinning'
import { setVariable, getVariableToRefs } from '../../src/global-variable'

describe('useSpinning', async () => {
  await setupMiniApp()

  const { reload, openSpin, closeSpin } = useSpinning()
  const globalMainLayoutLoad = getVariableToRefs('globalMainLayoutLoad')

  it('should open spinning', () => {
    openSpin()

    expect(globalMainLayoutLoad.value).toBe(true)
  })

  it('should close spinning', () => {
    openSpin()

    expect(globalMainLayoutLoad.value).toBe(true)

    closeSpin()

    expect(globalMainLayoutLoad.value).toBe(true)
  })

  it('should reload', () => {
    const wait = 1000

    reload(wait)

    expect(globalMainLayoutLoad.value).toBe(false)

    setTimeout(() => {
      expect(globalMainLayoutLoad.value).toBe(true)
    }, wait)
  })
})
