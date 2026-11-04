import { useWatermark } from '../../apps/admin/src/hooks/template/useWatermark'
import { useSettingGetters } from '../../apps/admin/src/store'
import setupMiniApp from '../utils/setupMiniApp'

describe('useWatermark', async () => {
  await setupMiniApp()

  const { setWatermarkContent, showWatermark, hiddenWatermark } = useWatermark()

  it('should set watermark content', () => {
    const { getWatermarkConfig } = useSettingGetters()
    const content = 'Ray Template Yes!'

    setWatermarkContent(content)

    expect(getWatermarkConfig.value.content).toBe(content)
  })

  it('should update watermark', () => {
    showWatermark()

    const { getWatermarkSwitch: show } = useSettingGetters()

    expect(show.value).toBe(true)

    hiddenWatermark()

    const { getWatermarkSwitch: hidden } = useSettingGetters()

    expect(hidden.value).toBe(false)
  })
  it('keeps the previous text when an empty string is supplied', () => {
    setWatermarkContent('Keep this')
    setWatermarkContent('')
    expect(useSettingGetters().getWatermarkConfig.value.content).toBe(
      'Keep this',
    )
  })
})
