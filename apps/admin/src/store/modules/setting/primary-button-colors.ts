/**
 *
 * @param primary 用户选择的主色
 * @param hover 悬停与聚焦状态的主色
 * @param surface 当前风格和明暗模式的卡片底色
 *
 * @description
 * 用浏览器解析 CSS 颜色，并把半透明填充合成在主题底色上。按钮使用同一不透明色，
 * 使文字对比度不受按钮下方实际页面内容影响。
 */
export function primaryButtonColors(
  primary: string,
  hover: string,
  surface: string,
) {
  const canvas = document.createElement('canvas')

  canvas.width = 2
  canvas.height = 1
  const context = canvas.getContext('2d')

  if (!context) return

  context.fillStyle = surface
  context.fillRect(0, 0, 2, 1)

  for (const [index, color] of [primary, hover].entries()) {
    context.fillStyle = color
    context.fillRect(index, 0, 1, 1)
  }

  const pixels = context.getImageData(0, 0, 2, 1).data
  const colors = (index: number) => {
    const rgb = Array.from(pixels.slice(index, index + 3))
    const [r, g, b] = rgb.map((byte) => {
      const channel = byte / 255

      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    })
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const blackContrast = (luminance + 0.05) / 0.05
    const whiteContrast = 1.05 / (luminance + 0.05)

    return {
      fill: `rgb(${rgb.join(', ')})`,
      text: blackContrast >= whiteContrast ? '#000' : '#fff',
    }
  }
  const normal = colors(0)
  const active = colors(4)

  return {
    colorPrimary: normal.fill,
    colorPressedPrimary: normal.fill,
    colorHoverPrimary: active.fill,
    colorFocusPrimary: active.fill,
    textColorPrimary: normal.text,
    textColorPressedPrimary: normal.text,
    textColorHoverPrimary: active.text,
    textColorFocusPrimary: active.text,
  }
}
