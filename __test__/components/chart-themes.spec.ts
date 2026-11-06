import { color } from 'echarts/core'
import { darkTheme, lightTheme } from 'naive-ui'
import { getCustomEchartTheme } from '../../packages/ui/src/RChart/src/utils/get-custom-echart-theme'
import { loadingOptions } from '../../packages/ui/src/RChart/src/utils/loading-options'
import {
  themeStyleOverrides,
  themeStyles,
} from '../../packages/ui/src/theme-presets'

const registeredThemes = getCustomEchartTheme()
const themes = new Map(registeredThemes.map(({ name, theme }) => [name, theme]))
const variants = themeStyles.flatMap((style) =>
  (['light', 'dark'] as const).map((mode) => ({
    style,
    mode,
    name: `ray-${style}${mode === 'dark' ? '-dark' : ''}`,
  })),
)

const composite = (foreground: number[], background: number[]) =>
  foreground
    .slice(0, 3)
    .map(
      (channel, index) =>
        channel * foreground[3] + background[index] * (1 - foreground[3]),
    )

const luminance = (rgb: number[]) =>
  rgb
    .map((channel) => {
      const value = channel / 255

      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    .reduce(
      (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
      0,
    )

const contrast = (foreground: string, background: string, surface = '#fff') => {
  // 暗色 Naive/Plain 文本和指示线含透明度；必须先与实际底色合成再计算对比度。
  const back = composite(color.parse(background), color.parse(surface))
  const front = composite(color.parse(foreground), back)
  const [lighter, darker] = [luminance(front), luminance(back)].sort(
    (a, b) => b - a,
  )

  return (lighter + 0.05) / (darker + 0.05)
}

it('registers every style in both modes with unique deterministic names', () => {
  expect(registeredThemes).toHaveLength(themes.size)
  expect([...themes.keys()]).toEqual(
    expect.arrayContaining(variants.map(({ name }) => name)),
  )
})

it.each(variants)(
  '$name matches the owning page surface',
  ({ style, mode, name }) => {
    const theme = themes.get(name)!
    const common = {
      ...(mode === 'dark' ? darkTheme : lightTheme).common,
      ...themeStyleOverrides[style][mode].common,
    }

    expect(color.parse(theme.backgroundColor)).toEqual(
      color.parse(common.cardColor),
    )
    expect(theme.darkMode).toBe(mode === 'dark')
    expect(color.parse(theme.pie.itemStyle.borderColor)).toEqual(
      color.parse(common.cardColor),
    )
  },
)

it.each(variants)(
  '$name keeps text, data, and active pointers legible',
  ({ name }) => {
    const theme = themes.get(name)!
    const background = theme.backgroundColor
    const textColors = [
      theme.textStyle.color,
      theme.title.textStyle.color,
      theme.title.subtextStyle.color,
      theme.legend.textStyle.color,
      ...['categoryAxis', 'valueAxis', 'timeAxis', 'logAxis'].map(
        (axis) => theme[axis].axisLabel.color,
      ),
    ]

    for (const foreground of textColors) {
      expect(
        contrast(foreground, background),
        `${name}: text ${foreground}`,
      ).toBeGreaterThanOrEqual(4.5)
    }

    expect(
      contrast(
        theme.tooltip.textStyle.color,
        theme.tooltip.backgroundColor,
        background,
      ),
    ).toBeGreaterThanOrEqual(4.5)
    const pointer = theme.tooltip.axisPointer

    expect(
      contrast(pointer.label.color, pointer.label.backgroundColor, background),
    ).toBeGreaterThanOrEqual(4.5)

    for (const foreground of [
      ...theme.color,
      pointer.lineStyle.color,
      pointer.crossStyle.color,
    ]) {
      expect(
        contrast(foreground, background),
        `${name}: mark ${foreground}`,
      ).toBeGreaterThanOrEqual(3)
    }
  },
)

it.each(variants)(
  '$name supplies a matching loading layer without mutating its theme',
  ({ mode, name }) => {
    const theme = themes.get(name)!
    const before = JSON.stringify(theme)
    const loading = loadingOptions(theme, mode === 'dark', 'Loading', {})
    const background = color.parse(theme.backgroundColor)

    expect(color.parse(loading.maskColor)).toEqual([
      ...background.slice(0, 3),
      0.9,
    ])
    expect(loading.color).toBe(theme.color[0])
    expect(loading.textColor).toBe(theme.textStyle.color)
    expect(JSON.stringify(theme)).toBe(before)
  },
)

it.each(['transparent', 'rgba(0, 0, 0, 0)', 'invalid', void 0])(
  'uses a mode-aware surface for a missing/transparent loading background (%s)',
  (backgroundColor) => {
    const theme = { backgroundColor }

    expect(
      color.parse(loadingOptions(theme, false, 'Loading', {}).maskColor),
    ).toEqual([255, 255, 255, 0.9])
    expect(
      color.parse(loadingOptions(theme, true, 'Loading', {}).maskColor),
    ).toEqual([23, 33, 49, 0.9])
  },
)

it('preserves caller loading overrides', () => {
  const overrides = {
    maskColor: 'transparent',
    showSpinner: false,
    text: 'Preparing',
  }

  expect(
    loadingOptions(themes.get('ray-modern'), false, 'Loading', overrides),
  ).toMatchObject(overrides)
})
