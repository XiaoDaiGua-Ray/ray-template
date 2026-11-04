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

  return {
    viewBox: svg[1].match(/viewBox=["']([^"']+)["']/i)?.[1],
    body: svg[2],
  }
}
