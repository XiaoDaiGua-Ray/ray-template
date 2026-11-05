<template>
  <main class="ray-home">
    <header class="ray-hero">
      <div>
        <h1>Ray Template</h1>
        <p class="ray-lead">
          v{{ version }} 将 Ray
          Admin、官网文档和共享包放在同一个工作区。可在文档里直接体验真实组件。
        </p>
        <div class="ray-actions">
          <a class="ray-start" :href="withBase('/guide/start.html')"
            >快速开始</a
          >
          <a class="ray-migrate" :href="withBase('/migration.html')"
            >v5 与 v6 的版本分界</a
          >
        </div>
      </div>

      <section class="ray-map" aria-labelledby="ray-map-title">
        <h2 id="ray-map-title">v6 工作区</h2>
        <svg class="ray-orbit" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="65" />
          <circle cx="100" cy="100" r="89" stroke-dasharray="3 6" />
          <path d="M100 0v200M0 100h200M29 29l142 142m0-142L29 171" />
          <circle cx="100" cy="100" r="7" fill="currentColor" />
        </svg>
        <ul>
          <li v-for="module in modules" :key="module.href">
            <a :href="withBase(module.href)">
              <span>{{ module.title }}</span>
              <code>{{ module.name }}</code>
            </a>
          </li>
        </ul>
      </section>
    </header>

    <section class="ray-paths" aria-labelledby="ray-paths-title">
      <h2 id="ray-paths-title">常用文档</h2>
      <ul>
        <li v-for="(card, index) in cards" :key="card.href">
          <a
            class="ray-path"
            :href="withBase(card.href)"
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
        <h2 id="ray-showcase-title">TablePro 自适应高度</h2>
        <p>表格填满可用高度，数据在表内滚动。</p>
        <div class="ray-showcase-links">
          <a :href="withBase('/reference/table-pro.html')">TablePro 用法</a>
          <a
            :href="
              withBase(
                '/reference/table-pro-examples.html#自适应高度与虚拟滚动',
              )
            "
            >在线示例</a
          >
        </div>
      </div>
      <img
        :src="withBase('/assets/tablepro-auto-height.png')"
        width="1440"
        height="820"
        loading="lazy"
        alt="TablePro 自适应高度示例，虚拟滚动已开启，分页位于表格底部"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import { version } from '../source.mts'

const modules = [
  { title: 'Ray Admin', name: 'apps/admin', href: '/guide/layout.html' },
  { title: '共享包', name: 'packages', href: '/guide/architecture.html' },
  { title: '页内交互', name: 'apps/docs', href: '/reference/table-pro.html' },
]

const cards = [
  {
    title: '第一个业务页面',
    summary: '添加订单列表、路由和菜单。',
    href: '/guide/first-page.html',
    icon: 'M6 3.5h8l4 4v13H6z M14 3.5v4h4 M9 12h6 M9 16h6',
  },
  {
    title: '组件与 Hooks',
    summary: '查找表单、弹窗和常用组合式函数。',
    href: '/reference/components.html',
    icon: 'M3.5 3.5h7v7h-7z M13.5 3.5h7v7h-7z M3.5 13.5h7v7h-7z M13.5 13.5h7v7h-7z',
  },
  {
    title: '构建与部署',
    summary: '检查项目并部署到站点子路径。',
    href: '/guide/tooling.html',
    icon: 'M4 8.5h16v11H4z M4 8.5l3-4h10l3 4 M12 16v-4 M10 14l2-2 2 2',
  },
]
</script>
