import {
  access,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const admin = new URL('dist/production/', root)
const docs = new URL('apps/docs/.vitepress/dist/', root)
const output = new URL('dist/pages/', root)
const origin = process.env.RAY_TEMPLATE_SITE_ORIGIN

await Promise.all([
  access(new URL('index.html', admin)),
  access(new URL('index.html', docs)),
])
await rm(output, { recursive: true, force: true })
await cp(admin, output, { recursive: true })
await cp(docs, new URL('docs/', output), { recursive: true })
console.log(`Pages artifact: ${fileURLToPath(output)}`)

if (origin) {
  const docsBase = new URL('/ray-template/docs/', origin)
  const legacy = fileURLToPath(new URL('dist/legacy-docs/', root))
  const docsRoot = fileURLToPath(docs)
  const files = await readdir(docsRoot, {
    recursive: true,
    withFileTypes: true,
  })

  await rm(legacy, { recursive: true, force: true })

  for (const entry of files) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue

    const file = join(entry.parentPath, entry.name)
    const path = relative(docsRoot, file).split(sep).join('/')

    if (path === '404.html' || path.startsWith('playground/')) continue

    const html = await readFile(file, 'utf8')
    const redirect = html.match(
      /http-equiv="refresh" content="0;url=([^"]+)"/,
    )?.[1]
    const target = new URL(
      redirect ?? path.replace(/(^|\/)index\.html$/, '$1'),
      docsBase,
    )

    if (
      target.origin !== docsBase.origin ||
      !target.pathname.startsWith(docsBase.pathname)
    ) {
      throw new Error(`Unexpected documentation redirect from ${path}`)
    }

    const url = target.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
    const outputFile = join(legacy, path)

    await mkdir(dirname(outputFile), { recursive: true })
    await writeFile(
      outputFile,
      `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>Ray Template 文档已迁移</title>
<script>
  const target = new URL(${JSON.stringify(target.href).replaceAll('<', '\\u003c')})
  if (!target.hash) target.hash = location.hash
  location.replace(target.href)
</script>
<noscript><meta http-equiv="refresh" content="0;url=${url}"></noscript>
<p><a href="${url}">前往新版 Ray Template 文档</a></p>
</html>
`,
    )
  }

  console.log(`Legacy documentation redirects: ${legacy}`)
}
