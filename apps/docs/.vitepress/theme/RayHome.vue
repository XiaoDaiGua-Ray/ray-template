<template>
  <main class="ray-home">
    <header class="ray-hero">
      <div>
        <h1>Ray Template</h1>
        <p class="ray-lead">
          v{{ version }}
          {{
            label(
              '将 Ray Admin、官网文档和共享包放在同一个工作区。可在文档里直接体验真实组件。',
              'puts Ray Admin, the documentation site, and shared packages in one workspace. Try the components directly in the docs.',
            )
          }}
        </p>
        <div class="ray-actions">
          <a class="ray-start" :href="docsLink('/guide/start.html')">
            {{ label('快速开始', 'Quick start') }}
          </a>
          <a class="ray-migrate" :href="docsLink('/migration.html')">
            {{ label('v5 与 v6 的版本分界', 'Moving from v5 to v6') }}
          </a>
        </div>
      </div>

      <section class="ray-map" aria-labelledby="ray-map-title">
        <h2 id="ray-map-title">{{ label('v6 工作区', 'v6 workspace') }}</h2>
        <svg class="ray-orbit" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="65" />
          <circle cx="100" cy="100" r="89" stroke-dasharray="3 6" />
          <path d="M100 0v200M0 100h200M29 29l142 142m0-142L29 171" />
          <circle cx="100" cy="100" r="7" fill="currentColor" />
        </svg>
        <ul>
          <li v-for="module in modules" :key="module.href">
            <a :href="docsLink(module.href)">
              <span>{{ module.title }}</span>
              <code>{{ module.name }}</code>
            </a>
          </li>
        </ul>
      </section>
    </header>

    <section class="ray-paths" aria-labelledby="ray-paths-title">
      <h2 id="ray-paths-title">{{ label('常用文档', 'Popular guides') }}</h2>
      <ul>
        <li v-for="(card, index) in cards" :key="card.href">
          <a
            class="ray-path"
            :href="docsLink(card.href)"
            :aria-labelledby="`ray-path-title-${index}`"
            :aria-describedby="`ray-path-summary-${index}`"
          >
            <article>
              <svg class="ray-path-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path :d="card.icon" />
              </svg>
              <h3 :id="`ray-path-title-${index}`">{{ card.title }}</h3>
              <p :id="`ray-path-summary-${index}`">{{ card.summary }}</p>
              <svg
                class="ray-path-arrow"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h13m-5-5 5 5-5 5" />
              </svg>
            </article>
          </a>
        </li>
      </ul>
    </section>

    <section class="ray-showcase" aria-labelledby="ray-showcase-title">
      <div>
        <h2 id="ray-showcase-title">
          {{ label('TablePro 自适应高度', 'TablePro with automatic height') }}
        </h2>
        <p>
          {{
            label(
              '表格填满可用高度，数据在表内滚动。',
              'The table fills the available height and scrolls its rows internally.',
            )
          }}
        </p>
        <div class="ray-showcase-links">
          <a :href="docsLink('/reference/table-pro.html')">
            {{ label('TablePro 用法', 'TablePro reference') }}
          </a>
          <a
            :href="
              docsLink(
                '/reference/table-pro-examples.html#自适应高度与虚拟滚动',
              )
            "
          >
            {{ label('在线示例', 'Live example') }}
          </a>
        </div>
      </div>
      <img
        :src="withBase('/assets/tablepro-auto-height.png')"
        width="1440"
        height="820"
        loading="lazy"
        :alt="
          label(
            'TablePro 自适应高度示例，虚拟滚动已开启，分页位于表格底部',
            'TablePro with automatic height, virtual scrolling, and a paginator at the bottom',
          )
        "
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { version } from '../source.mts'

const { localeIndex } = useData()
const english = computed(() => localeIndex.value === 'en')
const label = (zh: string, en: string) => (english.value ? en : zh)
const docsLink = (path: string) => withBase((english.value ? '/en' : '') + path)

const modules = computed(() => [
  { title: 'Ray Admin', name: 'apps/admin', href: '/guide/layout.html' },
  {
    title: label('共享包', 'Shared packages'),
    name: 'packages',
    href: '/guide/architecture.html',
  },
  {
    title: label('页内交互', 'Inline demos'),
    name: 'apps/docs',
    href: '/reference/table-pro.html',
  },
])

const cards = computed(() => [
  {
    title: label('第一个业务页面', 'Your first business page'),
    summary: label(
      '添加订单列表、路由和菜单。',
      'Add an order list, a route, and a menu entry.',
    ),
    href: '/guide/first-page.html',
    icon: 'M6 3.5h8l4 4v13H6z M14 3.5v4h4 M9 12h6 M9 16h6',
  },
  {
    title: label('组件与 Hooks', 'Components and hooks'),
    summary: label(
      '查找表单、弹窗和常用组合式函数。',
      'Find forms, dialogs, and commonly used composables.',
    ),
    href: '/reference/components.html',
    icon: 'M3.5 3.5h7v7h-7z M13.5 3.5h7v7h-7z M3.5 13.5h7v7h-7z M13.5 13.5h7v7h-7z',
  },
  {
    title: label('构建与部署', 'Build and deploy'),
    summary: label(
      '检查项目并部署到站点子路径。',
      'Check the project and deploy it under a site subpath.',
    ),
    href: '/guide/tooling.html',
    icon: 'M4 8.5h16v11H4z M4 8.5l3-4h10l3 4 M12 16v-4 M10 14l2-2 2 2',
  },
])
</script>
