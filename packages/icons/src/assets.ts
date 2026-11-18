import type { IconName } from './manifest'

const sources = import.meta.glob<string>('./**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getIconAsset(name: IconName) {
  const source = sources[`./${name}.svg`]
  const svg = source?.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/i)

  if (!svg) return

  const paint = Object.fromEntries(
    Array.from(
      svg[1].matchAll(/\s((?:fill|stroke)(?:-[\w-]+)?|opacity|color|style|preserveAspectRatio)\s*=\s*(["'])([\s\S]*?)\2/g),
      ([, name, , value]) => [name, value],
    ),
  )

  return {
    viewBox: svg[1].match(/viewBox=["']([^"']+)["']/i)?.[1],
    body: svg[2],
    paint,
  }
}
