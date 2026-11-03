import type { Plugin } from 'vite'

export const siteInfo = {
  title: 'Ray Template - Vue 3 中后台管理模板',
  description:
    'Ray Template 是基于 Vue 3、TypeScript（TSX）、Vite 和 Naive UI 的开源中后台管理模板，内置权限路由、响应式布局、数据表格和中英文切换。',
  repository: 'https://github.com/XiaoDaiGua-Ray/ray-template',
}

export function siteSeoPlugin(): Plugin {
  let homepage: URL | undefined

  return {
    name: 'ray-template-site-seo',
    configResolved({ base, command, mode }) {
      const siteOrigin = process.env.RAY_TEMPLATE_SITE_ORIGIN

      if (command !== 'build' || mode !== 'production' || !siteOrigin) return

      const origin = new URL(siteOrigin)

      if (
        !['http:', 'https:'].includes(origin.protocol) ||
        origin.href !== `${origin.origin}/` ||
        !base.startsWith('/') ||
        base.startsWith('//')
      ) {
        throw new Error(
          'RAY_TEMPLATE_SITE_ORIGIN 需要网站源地址，Vite base 需要站内绝对路径',
        )
      }

      homepage = new URL(base, origin)
    },
    transformIndexHtml() {
      if (!homepage) {
        return [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }]
      }

      const image = new URL('dashboard-preview.jpg', homepage).href

      return [
        { tag: 'link', attrs: { rel: 'canonical', href: homepage.href } },
        ...Object.entries({
          'og:type': 'website',
          'og:locale': 'zh_CN',
          'og:site_name': 'Ray Template',
          'og:title': siteInfo.title,
          'og:description': siteInfo.description,
          'og:url': homepage.href,
          'og:image': image,
          'og:image:alt': 'Ray Template 工作台和侧栏导航',
        }).map(([property, content]) => ({
          tag: 'meta',
          attrs: { property, content },
        })),
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
      ]
    },
    generateBundle() {
      if (!homepage) return

      const url = homepage.href.replaceAll('&', '&amp;')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}</loc></url>
</urlset>
`,
      })
    },
  }
}
