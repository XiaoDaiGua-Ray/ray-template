import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
const expectedNode = readFileSync(new URL('.nvmrc', root), 'utf8')
  .trim()
  .replace(/^v/, '')
const expectedPnpm = pkg.packageManager.split('@').at(-1)
const actualPnpm =
  process.env.npm_config_user_agent?.match(/pnpm\/([^ ]+)/)?.[1]
let failed = false

function check(ok, message) {
  console.log(`${ok ? '✓' : '✗'} ${message}`)
  failed ||= !ok
}

const [expectedMajor, expectedMinor, expectedPatch] = expectedNode
  .split('.')
  .map(Number)
const [actualMajor, actualMinor, actualPatch] = process.versions.node
  .split('.')
  .map(Number)
const compatibleNode =
  actualMajor === expectedMajor &&
  (actualMinor > expectedMinor ||
    (actualMinor === expectedMinor && actualPatch >= expectedPatch))

check(
  compatibleNode,
  `Node.js ${process.versions.node}（推荐 ${expectedNode}，执行 nvm install && nvm use）`,
)
check(
  actualPnpm === expectedPnpm,
  `pnpm ${actualPnpm ?? '未检测到'}（要求 ${expectedPnpm}，通过 pnpm env:check 运行）`,
)
check(
  existsSync(new URL('node_modules/.modules.yaml', root)),
  '依赖已安装（首次使用执行 pnpm install --frozen-lockfile）',
)
check(
  existsSync(new URL('pnpm-lock.yaml', root)),
  '存在 pnpm 锁文件，CI 使用 --frozen-lockfile',
)
console.log(`项目目录：${fileURLToPath(root)}`)
process.exitCode = failed ? 1 : 0
