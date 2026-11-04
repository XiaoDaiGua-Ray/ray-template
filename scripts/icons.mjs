import { fileURLToPath } from 'node:url'
import { generateIcons } from '../packages/icons/scripts/icons.mjs'

export * from '../packages/icons/scripts/icons.mjs'

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateIcons(process.argv.includes('--check'))
}
