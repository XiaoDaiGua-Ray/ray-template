import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, postcssIsolateStyles } from 'vitepress'
import { writeLegacyRedirects } from './legacy.mts'
import { createSidebar } from './sidebar.mts'
import { demo, repository, version } from './source.mts'

const base = '/ray-template/docs/'
const requestedRef = process.env.RAY_TEMPLATE_SOURCE_REF ?? ''
const sourceRef = /^[0-9a-f]{40}$/.test(requestedRef) ? requestedRef : 'main'

function createNav(english: boolean) {
  const prefix = english ? '/en' : ''

  return [
    {
      text: english ? 'Guide' : '指南',
      link: prefix + '/guide/start',
      activeMatch: '^' + prefix + '/guide/',
    },
    {
      text: english ? 'Architecture' : '架构',
      link: prefix + '/guide/architecture',
    },
    { text: english ? 'Migration' : '版本分界', link: prefix + '/migration' },
    {
      text: english ? 'API Reference' : 'API 参考',
      link: prefix + '/reference/',
      activeMatch: '^' + prefix + '/reference/',
    },
    { text: 'Ray Admin', link: demo },
  ]
}

export default defineConfig({
  base,
  title: 'Ray Template',
  titleTemplate: ':title · Ray Template 文档',
  description: `Ray Template ${version} 的 Monorepo 架构、版本分界、组件与交互示例。`,
  lang: 'zh-CN',
  locales: {
    root: {
      label: '简体中文',
      themeConfig: {
        nav: createNav(false),
        sidebar: createSidebar(false),
        outline: { label: '本页目录', level: [2, 3] },
        skipToContentLabel: '跳转到正文',
        docFooter: { prev: '上一页', next: '下一页' },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '文档目录',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色',
        darkModeSwitchTitle: '切换到深色',
        langMenuLabel: '切换语言',
        footer: { copyright: '© 2022–至今 Ray · MIT License' },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      titleTemplate: ':title · Ray Template Docs',
      description: `Architecture, migration, components, and interactive examples for Ray Template ${version}.`,
      themeConfig: {
        nav: createNav(true),
        sidebar: createSidebar(true),
        footer: { copyright: '© 2022–present Ray · MIT License' },
      },
    },
  },
  srcExclude: ['README.md', 'AGENTS.md'],
  vite: {
    plugins: [vueJsx()],
    resolve: {
      dedupe: ['vue'],
    },
    // 文档按容器尺寸排版，不沿用后台的设计稿单位转换。
    css: {
      postcss: {
        plugins: [
          postcssIsolateStyles({ includeFiles: [/(?:base|vp-doc)\.css$/] }),
        ],
      },
    },
  },
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: base + 'ray-mark.svg' },
    ],
  ],
  buildEnd: writeLegacyRedirects,
  themeConfig: {
    logo: { src: '/ray-mark.svg', alt: '' },
    siteTitle: 'Ray Template',
    outline: { level: [2, 3] },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '未找到相关内容',
                resetButtonTitle: '清除搜索',
                footer: {
                  selectText: '打开',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    socialLinks: [{ icon: 'github', link: repository }],
  },
  markdown: {
    config(md) {
      const renderLink = md.renderer.rules.link_open

      md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
        const token = tokens[index]
        const href = token.attrGet('href')
        const label = token.attrGet('aria-label')

        if (token.attrGet('class') === 'header-anchor' && label) {
          token.attrSet('aria-label', label.replace(/\s+\{#[^}]+\}(?="$)/u, ''))
        }

        for (const kind of ['blob', 'tree']) {
          const prefix = `${repository}/${kind}/main`

          if (href === prefix || href?.startsWith(`${prefix}/`)) {
            token.attrSet(
              'href',
              `${repository}/${kind}/${sourceRef}${href.slice(prefix.length)}`,
            )
          }
        }

        return renderLink
          ? renderLink(tokens, index, options, env, renderer)
          : renderer.renderToken(tokens, index, options)
      }
    },
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '危险',
      infoLabel: '说明',
      detailsLabel: '查看详情',
    },
  },
})
