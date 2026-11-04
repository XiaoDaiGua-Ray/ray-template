import { access, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { SiteConfig } from 'vitepress'

const redirects = {
  'guide/start': [
    'ray-template-docs/guide/concept',
    'ray-template-docs/guide/features',
    'ray-template-docs/guide/setup',
    'ray-template-docs/guide/why',
  ],
  'guide/routing': [
    'ray-template-docs/common-problem/keep-alive',
    'ray-template-docs/dev/auth',
    'ray-template-docs/dev/menu',
    'ray-template-docs/dev/router',
  ],
  'reference/store': ['ray-template-docs/dev/data-state/pinia'],
  'reference/store/runtime': [
    'ray-template-docs/dev/data-state/global-variable',
  ],
  'guide/requests': [
    'ray-template-docs/advanced/mock',
    'ray-template-docs/common-problem/request-cancel',
    'ray-template-docs/dev/axios',
    'docs/norm/api',
  ],
  'guide/appearance': [
    'ray-template-docs/advanced/echart-themes',
    'ray-template-docs/advanced/postcss',
    'ray-template-docs/dev/i18n',
    'ray-template-docs/dev/style',
    'docs/norm/css',
  ],
  'guide/tooling': [
    'ray-template-docs/advanced/cdn',
    'ray-template-docs/advanced/commit',
    'ray-template-docs/advanced/eslint',
    'ray-template-docs/advanced/husky',
    'ray-template-docs/advanced/types',
    'ray-template-docs/advanced/vitest',
    'ray-template-docs/common-problem/build',
    'ray-template-docs/common-problem/hmr',
    'ray-template-docs/dev/build',
    'ray-template-docs/dev/config',
    'ray-template-docs/dev/file',
    'ray-template-docs/dev/regulation',
    'docs/refer/env-configuration',
    'docs/refer/setup',
    ...['annotation', 'export', 'format', 'hook', 'import', 'name'].map(
      (name) => 'docs/norm/' + name,
    ),
  ],
  'reference/components': [
    'ray-template-docs/dev/component',
    'ray-template-docs/dev/scomponent',
    'docs/components/basic/description',
  ],
  'reference/components/app': [
    'ray-template-docs/advanced/app-global-provider',
  ],
  'reference/components/qr-code': ['docs/components/basic/qr-code'],
  'reference/components/barcode': ['docs/components/basic/r-barcode'],
  'reference/components/chart': ['docs/components/basic/r-chart'],
  'reference/components/collapse-grid': [
    'docs/components/basic/r-collapse-grid',
  ],
  'reference/components/form': ['docs/components/basic/r-form'],
  'reference/components/iframe': ['docs/components/basic/r-iframe'],
  'reference/components/modal': ['docs/components/basic/r-modal'],
  'reference/components/more-dropdown': [
    'docs/components/basic/r-more-dropdown',
  ],
  'reference/components/segment': ['docs/components/basic/r-segment'],
  'reference/components/route-transition': [
    'docs/components/basic/r-transition-component',
  ],
  'reference/table-pro': ['docs/components/basic/r-table'],
  'reference/icons#ricon-api': ['docs/components/basic/r-icon'],
  'reference/hooks': [
    'docs/hooks/description',
    ...['components', 'template', 'web'].map(
      (name) => 'ray-template-docs/advanced/hooks/' + name,
    ),
  ],
  ...Object.fromEntries(
    (
      [
        [
          'navigation',
          'template',
          ['useAppNavigation', 'useAppRoot', 'useBadge', 'useSiderBar'],
        ],
        [
          'layout',
          'template',
          ['useContentScroll', 'useMaximize', 'useSiderScroll', 'useSpinning'],
        ],
        ['appearance', 'template', ['useTheme', 'useWatermark']],
        ['appearance', 'web', ['useI18n']],
        ['navigation', 'web', ['useVueRouter']],
        ['browser', 'web', ['useDayjs', 'useDevice', 'useElementFullscreen']],
        ['interaction', 'web', ['usePagination']],
        ['interaction', 'components', ['useContextmenuCoordinate']],
        ['output', 'web', ['useDomToImage', 'usePrint']],
      ] as const
    ).flatMap(([page, group, names]) =>
      names.map((name) => [
        'reference/hooks/' + page + '#' + name.toLowerCase(),
        ['docs/hooks/' + group + '/' + name],
      ]),
    ),
  ),
  'reference/directives': [
    'ray-template-docs/dev/utils/directive/create-directive',
    'ray-template-docs/dev/utils/directive/directive',
  ],
  'reference/directives#v-copy': ['docs/directives/copy'],
  'reference/directives#v-debounce-与-v-throttle': [
    'docs/directives/debounce',
    'docs/directives/throttle',
  ],
  'reference/directives#v-ellipsis': ['docs/directives/ellipsis'],
  'reference/directives#v-ripple': ['docs/directives/ripple'],
  'reference/utils': [
    'ray-template-docs/advanced/reactivity',
    ...['basic', 'cache', 'dom', 'element', 'precision', 'vue'].map(
      (name) => 'ray-template-docs/dev/utils/' + name,
    ),
  ],
  'reference/source': ['ray-template-docs/advanced/version'],
}

export async function writeLegacyRedirects({ outDir, site }: SiteConfig) {
  for (const [target, sources] of Object.entries(redirects)) {
    const [page, anchor] = target.split('#', 2)

    await access(join(outDir, page + '.html'))
    const href = site.base + page + '.html' + (anchor ? '#' + anchor : '')

    for (const source of sources) {
      const file = join(outDir, source + '.html')

      await mkdir(dirname(file), { recursive: true })
      await writeFile(
        file,
        `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url=${href}">
<title>文档已迁移 · Ray Template</title>
<p>这篇文档已迁移。<a href="${href}">前往新版文档</a>。</p>
</html>
`,
        { flag: 'wx' },
      )
    }
  }
}
