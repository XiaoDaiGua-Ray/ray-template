import { useWatermark } from '../../src/hooks/template/useWatermark'
import { useSettingGetters } from '../../src/store'
import setupMiniApp from '../utils/setupMiniApp'

describe('useWatermark', async () => {
  await setupMiniApp()

  const { setWatermarkContent, showWatermark, hiddenWatermark } = useWatermark()

  it('should set watermark content', () => {
    const { getWatermarkConfig } = useSettingGetters()
    const watermarkConfig = getWatermarkConfig.value
    const content = 'Ray Template Yes!'

    setWatermarkContent(content)

    expect(watermarkConfig.content).toBe(content)
  })

  it('should update watermark', () => {
    showWatermark()

    const { getWatermarkSwitch: show } = useSettingGetters()

    expect(show.value).toBe(true)

    hiddenWatermark()

    const { getWatermarkSwitch: hidden } = useSettingGetters()

    expect(hidden.value).toBe(false)
  })
})
